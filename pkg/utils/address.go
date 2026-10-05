package utils

import (
	"regexp"

	"github.com/ethereum/go-ethereum/common"
)

// IsValidAddress meriksa apakah string alamat Ethereum valid.
// Fungsi ini digunakan untuk mengecek format Hex dasar serta keabsahan checksum jika menggunakan mixed-case.
func IsValidAddress(address string) bool {
	// 1. Cek regex dasar untuk format Ethereum: diawali 0x dan diikuti 40 karakter hex
	re := regexp.MustCompile("^0x[0-9a-fA-F]{40}$")
	if !re.MatchString(address) {
		return false
	}

	// 2. Menggunakan helper dari go-ethereum/common
	return common.IsHexAddress(address)
}