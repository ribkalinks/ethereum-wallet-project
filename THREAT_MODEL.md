echo "# 🛡 Threat Model: Ethereum Web3 Desktop Wallet

## 1. Overview & System Boundaries
Aplikasi ini adalah Web3 Desktop Wallet berbasis Wails (Go + React) dengan database PostgreSQL.

## 2. Threat Analysis (STRIDE)
- Spoofing: Autentikasi lokal & enkripsi kunci.
- Tampering: Validasi parameter input di Go Backend.
- Repudiation: Pencatatan log transaksi di PostgreSQL.
- Information Disclosure: Enkripsi Keystore AES-GCM.
- Denial of Service: Internal rate-limiting pada RPC.
- Elevation of Privilege: Kontainer PostgreSQL non-root.

## 3. Key Management
Private Key disimpan terenkripsi di lokal dan hanya diproses di memory Go backend saat offline signing." > THREAT_MODEL.md