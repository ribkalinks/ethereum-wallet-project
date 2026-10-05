package wallet

import (
	"fmt"

	hdwallet "github.com/miguelmota/go-ethereum-hdwallet"
	"github.com/tyler-smith/go-bip39"
)

// WalletAccount menyimpan data wallet lengkap dengan Mnemonic (Seed Phrase)
type WalletAccount struct {
	Address    string `json:"address"`
	PrivateKey string `json:"privateKey"`
	Mnemonic   string `json:"mnemonic"`
}

// GenerateNewWallet membuat 12 kata Mnemonic (BIP-39) dan mendatangkan Ethereum HD Wallet (BIP-44)
func GenerateNewWallet() (*WalletAccount, error) {
	// 1. Generate 128-bit entropy untuk 12 kata mnemonic
	entropy, err := bip39.NewEntropy(128)
	if err != nil {
		return nil, fmt.Errorf("gagal generate entropy: %v", err)
	}

	// 2. Buat Mnemonic 12 kata dari entropy
	mnemonic, err := bip39.NewMnemonic(entropy)
	if err != nil {
		return nil, fmt.Errorf("gagal generate mnemonic: %v", err)
	}

	// 3. Buat HD Wallet dari Mnemonic
	wallet, err := hdwallet.NewFromMnemonic(mnemonic)
	if err != nil {
		return nil, fmt.Errorf("gagal membuat HD wallet dari mnemonic: %v", err)
	}

	// 4. Tentukan Derivation Path standar Ethereum (m/44'/60'/0'/0/0)
	path := hdwallet.MustParseDerivationPath("m/44'/60'/0'/0/0")
	account, err := wallet.Derive(path, false)
	if err != nil {
		return nil, fmt.Errorf("gagal derive account: %v", err)
	}

	// 5. Ambil Private Key dalam bentuk Hex String
	privateKeyHex, err := wallet.PrivateKeyHex(account)
	if err != nil {
		return nil, fmt.Errorf("gagal me-retrieve private key hex: %v", err)
	}

	return &WalletAccount{
		Address:    account.Address.Hex(),
		PrivateKey: privateKeyHex,
		Mnemonic:   mnemonic,
	}, nil
}