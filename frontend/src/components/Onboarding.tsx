import React, { useState } from 'react';
import { CreateNewWallet, ExportKeystore } from '../../wailsjs/go/main/App';

interface OnboardingProps {
  onWalletCreated: (address: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onWalletCreated }) => {
  const [step, setStep] = useState<number>(1);
  const [password, setPassword] = useState<string>('');
  const [mnemonic, setMnemonic] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 1. Generate Wallet Baru via Go Backend
  const handleCreateWallet = async () => {
    if (!password) return;
    setIsLoading(true);
    try {
      const wallet = await CreateNewWallet();
      setMnemonic(wallet.mnemonic);
      setPrivateKey(wallet.privateKey);
      setAddress(wallet.address);
      setStep(2); // Lanjut ke step simpan seed phrase
    } catch (err) {
      alert('Gagal membuat wallet: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Simpan Keystore Terenkripsi & Selesaikan Onboarding
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await ExportKeystore(privateKey, password);
      onWalletCreated(address);
    } catch (err) {
      alert('Gagal menyimpan keystore: ' + err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '16px', maxWidth: '500px', margin: '0 auto', color: '#fff', textAlign: 'left' }}>
      {step === 1 && (
        <div>
          <h2 style={{ marginTop: 0 }}>Buat Wallet Baru</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Masukkan password untuk mengamankan private key kamu di perangkat ini.</p>
          
          <input
            type="password"
            placeholder="Masukkan Password Vault"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '16px', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleCreateWallet}
            disabled={!password || isLoading}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#3b82f6', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {isLoading ? 'Generating...' : 'Lanjutkan'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ marginTop: 0 }}>Simpan Seed Phrase</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Catat 12 kata ini di tempat aman. Jangan berikan kepada siapa pun!</p>

          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px', filter: isRevealed ? 'none' : 'blur(4px)', transition: 'all 0.3s' }}>
            <p style={{ fontFamily: 'monospace', color: '#38bdf8', wordSpacing: '8px', margin: 0 }}>
              {mnemonic}
            </p>
          </div>

          {!isRevealed && (
            <button
              onClick={() => setIsRevealed(true)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: '#334155', color: '#fff', border: 'none', marginBottom: '16px', cursor: 'pointer' }}
            >
              Klik untuk Tampilkan Seed Phrase
            </button>
          )}

          <button
            onClick={handleFinish}
            disabled={!isRevealed || isLoading}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {isLoading ? 'Saving Keystore...' : 'Saya Sudah Menyimpannya'}
          </button>
        </div>
      )}
    </div>
  );
};