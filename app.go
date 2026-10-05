package main

import (
	"context"
	"fmt"
	"log"
	"math/big"
	"path/filepath"

	"ethereum-wallet-project/pkg/database" // Import package database
	"ethereum-wallet-project/pkg/ethclient"
	"ethereum-wallet-project/pkg/utils"
	"ethereum-wallet-project/pkg/wallet"
)

// App struct
type App struct {
	ctx       context.Context
	ethClient *ethclient.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts.
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx

	// 1. Inisialisasi koneksi RPC Sepolia
	client, err := ethclient.ConnectRPC()
	if err != nil {
		log.Printf("❌ Connection Error: %v\n", err)
	} else {
		a.ethClient = client
	}

	// 2. Inisialisasi koneksi Database PostgreSQL & Auto-Migration
	_, err = database.InitDB()
	if err != nil {
		log.Printf("❌ Database Init Error: %v\n", err)
	} else {
		fmt.Println("✅ Database PostgreSQL & Auto-Migration Berhasil!")
	}
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

// ValidateAddress memeriksa apakah sebuah alamat Ethereum valid
func (a *App) ValidateAddress(address string) bool {
	return utils.IsValidAddress(address)
}

// GetETHBalance mengambil saldo ETH untuk alamat yang diberikan
func (a *App) GetETHBalance(address string) (string, error) {
	// 1. Validasi alamat terlebih dahulu
	if !utils.IsValidAddress(address) {
		return "0.0000", fmt.Errorf("alamat Ethereum tidak valid")
	}

	// 2. Cek koneksi RPC
	if a.ethClient == nil {
		return "0.0000", fmt.Errorf("koneksi RPC belum terhubung")
	}

	// 3. Panggil fungsi ethclient
	return a.ethClient.GetETHBalance(address)
}

// GetTransactionHistory mengambil daftar riwayat transaksi dari Etherscan
func (a *App) GetTransactionHistory(address string) ([]ethclient.Transaction, error) {
	if !utils.IsValidAddress(address) {
		return nil, fmt.Errorf("alamat Ethereum tidak valid")
	}

	if a.ethClient == nil {
		return nil, fmt.Errorf("koneksi client belum terhubung")
	}

	return a.ethClient.GetTransactionHistory(address)
}

// CreateNewWallet mengekspos fungsi generate wallet (BIP-39 Mnemonic) ke React
func (a *App) CreateNewWallet() (*wallet.WalletAccount, error) {
	newWallet, err := wallet.GenerateNewWallet()
	if err != nil {
		return nil, err
	}
	return newWallet, nil
}

// ExportKeystore mengenkripsi wallet dan menyimpannya ke folder ./keystores
func (a *App) ExportKeystore(privateKeyHex string, password string) (string, error) {
	storageDir := filepath.Join(".", "keystores")
	filePath, err := wallet.ExportToKeystore(privateKeyHex, password, storageDir)
	if err != nil {
		return "", err
	}
	return filePath, nil
}

// ValidateKeystorePassword memeriksa kecocokan password file keystore
func (a *App) ValidateKeystorePassword(filePath string, password string) (bool, error) {
	return wallet.VerifyKeystorePassword(filePath, password)
}

// EstimateGasPrice mengembalikan estimasi harga gas saat ini (dalam Gwei)
func (a *App) EstimateGasPrice() (string, error) {
	if a.ethClient == nil {
		return "0", fmt.Errorf("koneksi RPC belum terhubung")
	}

	gasPriceWei, err := a.ethClient.EstimateGasPrice()
	if err != nil {
		return "0", err
	}

	// Ubah nilai Wei ke Gwei untuk kemudahan tampilan di UI
	gasPriceGwei := new(big.Float).Quo(new(big.Float).SetInt(gasPriceWei), big.NewFloat(1e9))
	return gasPriceGwei.Text('f', 2), nil
}

// EstimateTransactionFee menghitung estimasi total biaya transaksi dalam ETH
func (a *App) EstimateTransactionFee(from string, to string, amountETH string) (string, error) {
	if a.ethClient == nil {
		return "0", fmt.Errorf("koneksi RPC belum terhubung")
	}

	// Konversi amount ETH ke Wei
	ethFloat, _, err := big.ParseFloat(amountETH, 10, 0, big.ToNearestEven)
	if err != nil {
		return "0", fmt.Errorf("jumlah ETH tidak valid")
	}
	weiFactor := new(big.Float).SetInt(new(big.Int).Exp(big.NewInt(10), big.NewInt(18), nil))
	valueWei, _ := new(big.Float).Mul(ethFloat, weiFactor).Int(nil)

	// Get Gas Price & Gas Limit
	gasPrice, err := a.ethClient.EstimateGasPrice()
	if err != nil {
		return "0", err
	}

	gasLimit, err := a.ethClient.EstimateGasLimit(from, to, valueWei, nil)
	if err != nil {
		// Default fallback untuk transfer ETH biasa jika estimasi gagal
		gasLimit = 21000
	}

	// Total Fee = Gas Limit * Gas Price (dalam Wei)
	totalFeeWei := new(big.Int).Mul(big.NewInt(int64(gasLimit)), gasPrice)

	// Konversi Total Fee Wei ke ETH
	totalFeeETH := new(big.Float).Quo(new(big.Float).SetInt(totalFeeWei), weiFactor)
	return totalFeeETH.Text('f', 6), nil
}

// SendTransaction mengeksekusi transfer ETH dan mengembalikan hash transaksi
func (a *App) SendTransaction(privateKeyHex string, toAddress string, amountETH string) (string, error) {
	if a.ethClient == nil {
		return "", fmt.Errorf("koneksi RPC belum terhubung")
	}

	txHash, err := a.ethClient.SendETH(privateKeyHex, toAddress, amountETH)
	if err != nil {
		return "", err
	}

	return txHash, nil
}