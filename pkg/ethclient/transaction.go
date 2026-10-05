package ethclient

import (
	"context"
	"crypto/ecdsa"
	"fmt"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/crypto"
)

// SendETH membuat transaksi, menandatanganinya secara offline, dan mempublikasikannya ke RPC
func (c *Client) SendETH(privateKeyHex string, toHex string, amountETH string) (string, error) {
	// 1. Dekode Private Key
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return "", fmt.Errorf("private key tidak valid: %v", err)
	}

	publicKey := privateKey.Public()
	publicKeyECDSA, ok := publicKey.(*ecdsa.PublicKey)
	if !ok {
		return "", fmt.Errorf("gagal mengonversi public key")
	}
	fromAddress := crypto.PubkeyToAddress(*publicKeyECDSA)

	// 2. Ambil Nonce & Chain ID dari Network
	nonce, err := c.ETHClient.PendingNonceAt(context.Background(), fromAddress)
	if err != nil {
		return "", fmt.Errorf("gagal mengambil nonce: %v", err)
	}

	chainID, err := c.ETHClient.ChainID(context.Background())
	if err != nil {
		return "", fmt.Errorf("gagal mengambil chain ID: %v", err)
	}

	// 3. Konversi Jumlah ETH ke Wei
	ethFloat, _, err := big.ParseFloat(amountETH, 10, 0, big.ToNearestEven)
	if err != nil {
		return "", fmt.Errorf("jumlah ETH tidak valid: %v", err)
	}
	weiFactor := new(big.Float).SetInt(new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil))
	valueWei, _ := new(big.Float).Mul(ethFloat, weiFactor).Int(nil)

	// 4. Ambil Gas Price saat ini
	gasPrice, err := c.ETHClient.SuggestGasPrice(context.Background())
	if err != nil {
		return "", fmt.Errorf("gagal mengambil gas price: %v", err)
	}

	toAddress := common.HexToAddress(toHex)
	gasLimit := uint64(21000) // Standard unit gas transfer ETH

	// 5. Buat Unsigned Transaction & Sign Secara Local/Offline
	txData := &types.LegacyTx{
		Nonce:    nonce,
		To:       &toAddress,
		Value:    valueWei,
		Gas:      gasLimit,
		GasPrice: gasPrice,
		Data:     nil,
	}
	tx := types.NewTx(txData)

	signer := types.NewEIP155Signer(chainID)
	signedTx, err := types.SignTx(tx, signer, privateKey)
	if err != nil {
		return "", fmt.Errorf("gagal menandatangani transaksi: %v", err)
	}

	// 6. Broadcast Signed Raw Transaction ke Node Sepolia
	err = c.ETHClient.SendTransaction(context.Background(), signedTx)
	if err != nil {
		return "", fmt.Errorf("gagal mempublikasikan transaksi: %v", err)
	}

	return signedTx.Hash().Hex(), nil
}