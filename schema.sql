-- 1. Buat Tabel Users / Accounts
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY ,
    address VARCHAR(42) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--2. Buat Tabel Contacts (Address Book / Buku Alamat)
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    user_address VARCHAR(42) NOT NULL,
    contacts_name VARCHAR(100) NOT NULL,
    contacts_address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ConsTRAINT fk_user FOREIGN KEY(user_address) REFERENCES users(address) ON DELETE CASCADE
);

--3. Buat Tabel Transaction Logs (Metadata Riwayat Transaksi Lokal)
CREATE TABLE IF NOT EXISTS transaction_logs (
    id SERIAL PRIMARY KEY, 
    tx_hash VARCHAR(66) UNIQUE NOT NULL,
    from_address VARCHAR(42) NOT NULL,
    to_address VARCHAR(42) NOT NULL,
    amount_eth NUMERIC(38, 18) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
