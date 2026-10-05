package database

import (
	"time"
)

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Address   string    `gorm:"size:42;unique;not null" json:"address"` // Ubah uniqueIndex menjadi unique
	CreatedAt time.Time `json:"created_at"`
	Contacts  []Contact `gorm:"foreignKey:UserAddress;references:Address"`
}

type Contact struct {
	ID             uint      `gorm:"primaryKey" json:"id"`
	UserAddress    string    `gorm:"size:42;not null;index" json:"user_address"`
	ContactName    string    `gorm:"size:100;not null" json:"contact_name"`
	ContactAddress string    `gorm:"size:42;not null" json:"contact_address"`
	CreatedAt      time.Time `json:"created_at"`
}

type TransactionLog struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	TxHash      string    `gorm:"size:66;unique;not null" json:"tx_hash"` // Ubah uniqueIndex menjadi unique
	FromAddress string    `gorm:"size:42;not null" json:"from_address"`
	ToAddress   string    `gorm:"size:42;not null" json:"to_address"`
	AmountETH   string    `gorm:"type:numeric(38,18);not null" json:"amount_eth"`
	Status      string    `gorm:"size:20;default:'PENDING'" json:"status"`
	CreatedAt   time.Time `json:"created_at"`
}