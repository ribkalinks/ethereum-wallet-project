package ethclient

import (
	"context"
	"fmt"
	"math"
	"math/big"

	"github.com/ethereum/go-ethereum/common"
)

// GetETHBalance mengambil saldo ETH (konversi dari Wei ke ETH) untuk alamat publik tertentu
func (c *Client) GetETHBalance(addressHex string) (string, error) {
	account := common.HexToAddress(addressHex)

	// Fetch balance dalam satuan Wei dari blockchain
	balanceWei, err := c.ETHClient.BalanceAt(context.Background(), account, nil)
	if err != nil {
		return "", fmt.Errorf("gagal mengambil saldo: %v", err)
	}

	// Konversi Wei ke ETH (1 ETH = 10^18 Wei)
	fbalance := new(big.Float)
	fbalance.SetString(balanceWei.String())

	ethValue := new(big.Float).Quo(fbalance, big.NewFloat(math.Pow10(18)))

	// Return dalam format string 4 angka di belakang koma (misal: "1.2500")
	return fmt.Sprintf("%.4f", ethValue), nil
}