import { useState } from 'react';
import { AddressSearchBar } from './components/AddressSearchBar';
import { BalanceCard } from './components/BalanceCard';
import { TransactionTable } from './components/TransactionTable';
import { GetETHBalance, GetTransactionHistory } from '../wailsjs/go/main/App';
import { ethclient } from '../wailsjs/go/models';

function App() {
  const [activeAddress, setActiveAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.0000');
  const [transactions, setTransactions] = useState<ethclient.Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (searchedAddress: string) => {
    setActiveAddress(searchedAddress);
    setLoading(true);

    try {
      const [ethBal, txHistory] = await Promise.all([
        GetETHBalance(searchedAddress),
        GetTransactionHistory(searchedAddress)
      ]);

      setBalance(ethBal);
      setTransactions(txHistory || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '40px 20px',
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', color: '#60a5fa' }}>
          Ethereum Wallet Explorer 🚀
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          Search balance and transaction history for any Sepolia Testnet address
        </p>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto' }}>
        <AddressSearchBar onSearch={handleSearch} isLoading={loading} />

        {activeAddress && (
          <>
            <BalanceCard address={activeAddress} balance={balance} isLoading={loading} />
            <TransactionTable transactions={transactions} isLoading={loading} />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
