import React, { useState, useEffect } from 'react';

// Import fungsi Wails Binding
import { SendTransaction, EstimateTransactionFee, EstimateGasPrice } from '../../wailsjs/go/main/App';

interface SendETHProps {
  userPrivateKey: string;
  onSuccess?: (txHash: string) => void;
}

export const SendETH: React.FC<SendETHProps> = ({ userPrivateKey, onSuccess }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [estimatedFee, setEstimatedFee] = useState<string>('0');
  const [gasPriceGwei, setGasPriceGwei] = useState<string>('0');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  // 1. Hitung estimasi gas fee saat nominal atau alamat penerima berubah
  useEffect(() => {
    const updateGasEstimate = async () => {
      if (recipient.length === 42 && amount && parseFloat(amount) > 0) {
        try {
          const fee = await EstimateTransactionFee(userPrivateKey, recipient, amount);
          const price = await EstimateGasPrice();
          setEstimatedFee(fee);
          setGasPriceGwei(price);
          setError('');
        } catch (err: any) {
          setError('Gagal menghitung estimasi gas fee: ' + err.message);
        }
      }
    };

    const timer = setTimeout(() => updateGasEstimate(), 500);
    return () => clearTimeout(timer);
  }, [recipient, amount]);

  // 2. Buka Modal Konfirmasi
  const handleOpenConfirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      setError('Harap masukkan alamat penerima dan nominal ETH yang valid.');
      return;
    }
    setError('');
    setIsModalOpen(true);
  };

  // 3. Eksekusi Transaksi (Panggil Backend Go)
  const handleConfirmSend = async () => {
    setIsLoading(true);
    setStatusMessage('Menandatangani transaksi secara offline & menyiarkan ke jaringan...');
    try {
      const hash = await SendTransaction(userPrivateKey, recipient, amount);
      setTxHash(hash);
      setStatusMessage('Transaksi berhasil dipublikasikan!');
      if (onSuccess) onSuccess(hash);
    } catch (err: any) {
      setError('Transaksi Gagal: ' + (err.message || err));
      setIsModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="send-eth-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Send ETH (Sepolia)</h2>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleOpenConfirmation}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Alamat Penerima (Recipient)</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Jumlah (ETH)</label>
          <input
            type="number"
            step="0.0001"
            placeholder="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
          <small>
            <div><strong>Gas Price:</strong> {gasPriceGwei} Gwei</div>
            <div><strong>Estimasi Biaya Transaksi:</strong> {estimatedFee} ETH</div>
          </small>
        </div>

        <button type="submit" style={{ width: '100%', padding: '10px', cursor: 'pointer' }}>
          Review Transaction
        </button>
      </form>

      {/* 4. Confirmation Modal */}
      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="modal-content" style={{ background: '#fff', padding: '20px', borderRadius: '8px', width: '400px' }}>
            <h3>Konfirmasi Transaksi</h3>
            <p><strong>Tujuan:</strong> {recipient}</p>
            <p><strong>Jumlah:</strong> {amount} ETH</p>
            <p><strong>Estimasi Gas:</strong> ~{estimatedFee} ETH</p>
            <hr />
            <p><strong>Total Dipotong:</strong> {(parseFloat(amount || '0') + parseFloat(estimatedFee || '0')).toFixed(6)} ETH</p>

            {isLoading ? (
              <div>
                <p style={{ color: 'blue' }}>{statusMessage}</p>
              </div>
            ) : txHash ? (
              <div>
                <p style={{ color: 'green' }}>✅ Transaksi Sukses!</p>
                <p style={{ wordBreak: 'break-all', fontSize: '12px' }}>
                  <strong>Tx Hash:</strong> {txHash}
                </p>
                <a 
                  href={`https://sepolia.etherscan.io/tx/${txHash}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ display: 'inline-block', marginTop: '10px' }}
                >
                  Lihat di Etherscan ↗
                </a>
                <button onClick={() => { setIsModalOpen(false); setTxHash(''); setAmount(''); setRecipient(''); }} style={{ display: 'block', width: '100%', marginTop: '15px' }}>
                  Selesai
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '8px' }}>
                  Batal
                </button>
                <button onClick={handleConfirmSend} style={{ flex: 1, padding: '8px', background: '#007bff', color: '#fff' }}>
                  Kirim Sekarang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};