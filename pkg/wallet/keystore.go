package wallet

import (
	"fmt"
	"os"

	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
)

// ExportToKeystore mengenkripsi Private Key dengan password lalu menyimpannya ke direktori lokal
func ExportToKeystore(privateKeyHex string, password string, storageDir string) (string, error) {
	// 1. Parsing Private Key Hex ke ECDSA Key
	privateKey, err := crypto.HexToECDSA(privateKeyHex)
	if err != nil {
		return "", fmt.Errorf("invalid private key format: %v", err)
	}

	// 2. Pastikan folder penyimpanan ada
	if err := os.MkdirAll(storageDir, 0700); err != nil {
		return "", fmt.Errorf("failed to create keystore directory: %v", err)
	}

	// 3. Inisialisasi Keystore Manager Go-Ethereum
	ks := keystore.NewKeyStore(storageDir, keystore.StandardScryptN, keystore.StandardScryptP)

	// 4. Import Private Key & enkripsi dengan password
	account, err := ks.ImportECDSA(privateKey, password)
	if err != nil {
		return "", fmt.Errorf("failed to encrypt keystore: %v", err)
	}

	return account.URL.Path, nil
}

// VerifyKeystorePassword memverifikasi apakah password sesuai dengan file Keystore JSON
func VerifyKeystorePassword(keystoreJSONPath string, password string) (bool, error) {
	keyjson, err := os.ReadFile(keystoreJSONPath)
	if err != nil {
		return false, fmt.Errorf("failed to read keystore file: %v", err)
	}

	// Decrypt keystore JSON dengan password
	_, err = keystore.DecryptKey(keyjson, password)
	if err != nil {
		return false, nil // Password salah
	}

	return true, nil // Password benar
}