# Ethereum Web3 Desktop Wallet

Web3 Desktop Wallet application built with Go, Wails, React-TS, and PostgreSQL.

## 🏗️ System Architecture

Proyek Web3 Desktop Wallet ini menggunakan pola **3-Tier Containerized Architecture** untuk memastikan pemisahan tugas yang jelas antara antarmuka pengguna, logika backend, dan penyimpanan data persisten.

### Diagram Arsitektur
```mermaid
graph TD
    subgraph "Client / Desktop Environment"
        A["Wails Frontend UI <br/> HTML/TS/Vite"]
    end

    subgraph "Backend"
        B["Go Backend App <br/> Wails Desktop Binding"]
    end

    subgraph "Database"
        C["PostgreSQL"]
    end

    A -->|IPC / Binding| B
    B -->|SQL| C

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
```