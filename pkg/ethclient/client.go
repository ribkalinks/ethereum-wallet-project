package ethclient

import (
	"context"
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
)

// Client membungkus koneksi go-ethereum RPC
type Client struct {
	ETHClient *ethclient.Client
}

// ConnectRPC menghubungkan aplikasi ke node Ethereum (Sepolia)
func ConnectRPC() (*Client, error) {
	_ = godotenv.Load()

	rpcURL := os.Getenv("SEPOLIA_RPC_URL")
	if rpcURL == "" {
		return nil, fmt.Errorf("SEPOLIA_RPC_URL tidak ditemukan di .env")
	}

	client, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("gagal terhubung ke RPC: %v", err)
	}

	return &Client{ETHClient: client}, nil
}

// EstimateGasPrice mengambil estimasi Gas Price saat ini dalam Wei dari RPC
func (c *Client) EstimateGasPrice() (*big.Int, error) {
	gasPrice, err := c.ETHClient.SuggestGasPrice(context.Background())
	if err != nil {
		return nil, err
	}
	return gasPrice, nil
}

// EstimateGasLimit menghitung estimasi batas unit gas untuk suatu transaksi
func (c *Client) EstimateGasLimit(fromHex string, toHex string, valueWei *big.Int, data []byte) (uint64, error) {
	fromAddress := common.HexToAddress(fromHex)
	toAddress := common.HexToAddress(toHex)

	callMsg := ethereum.CallMsg{
		From:  fromAddress,
		To:    &toAddress,
		Value: valueWei,
		Data:  data,
	}

	gasLimit, err := c.ETHClient.EstimateGas(context.Background(), callMsg)
	if err != nil {
		return 0, err
	}
	return gasLimit, nil
}