package database

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() (*gorm.DB, error) {
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("gagal terhubung ke database postgresql: %v", err)
	}

	// Auto Migrate Schema
	err = db.AutoMigrate(&User{}, &Contact{}, &TransactionLog{})
	if err != nil {
		return nil, fmt.Errorf("gagal menjalankan auto-migration: %v", err)
	}

	log.Println("Koneksi PostgreSQL & Auto-Migration Berhasil!")
	DB = db
	return db, nil
}