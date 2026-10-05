package ethclient

import (
	"encoding/json"
	"fmt"
	"math"
	"math/big"
	"net/http"
	"os"
	"time"
)

// Transaction Tx Structure untuk dikirimkan ke Frontend
type Transaction struct {
	Hash        string `json:"hash"`
	From        string `json:"from"`
	To          string `json:"to"`
	ValueETH    string `json:"valueEth"`
	TimeStamp   string `json:"timeStamp"`
	IsError     string `json:"isError"`
	BlockNumber string `json:"blockNumber"`
}

type EtherscanResponse struct {
	Status  string        `json:"status"`
	Message string        `json:"message"`
	Result  []Transaction `json:"result"`
}

// GetTransactionHistory mengambil 10 transaksi terakhir dari Etherscan Sepolia API
func (c *Client) GetTransactionHistory(address string) ([]Transaction, error) {
	apiKey := os.Getenv("ETHERSCAN_API_KEY")

	// Endpoint API Etherscan Sepolia
	url := fmt.Sprintf(
		"https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=%s&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=%s",
		address, apiKey,
	)

	httpClient := &http.Client{Timeout: 10 * time.Second}
	resp, err := httpClient.Get(url)
	if err != nil {
		return nil, fmt.Errorf("gagal menghubungi Etherscan API: %v", err)
	}
	defer resp.Body.Close()

	var apiResp EtherscanResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		return nil, fmt.Errorf("gagal parsing respon JSON: %v", err)
	}

	// Konversi nilai Wei ke ETH untuk setiap transaksi
	var formattedTxs []Transaction
	for _, tx := range apiResp.Result {
		fbalance := new(big.Float)
		fbalance.SetString(tx.ValueETH) // Aslinya masih satuan Wei dari Etherscan

		// Nilai default jika empty
		ethStr := "0.0000"
		if tx.ValueETH != "" {
			valWei, ok := new(big.Float).SetString(tx.ValueETH)
			if ok {
				ethVal := new(big.Float).Quo(valWei, big.NewFloat(math.Pow10(18)))
				ethStr = fmt.Sprintf("%.4f", ethVal)
			}
		}

		formattedTxs = append(formattedTxs, Transaction{
			Hash:        tx.Hash,
			From:        tx.From,
			To:          tx.To,
			ValueETH:    ethStr,
			TimeStamp:   tx.TimeStamp,
			IsError:     tx.IsError,
			BlockNumber: tx.BlockNumber,
		})
	}

	return formattedTxs, nil
}