import React, { useState } from 'react';

interface ImportWalletProps {
  onWalletImported: (address: string) => void;
  onCancel: () => void;
}

export const ImportWallet: React.FC<ImportWalletProps> = ({ onWalletImported, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'seed' | 'keystore'>('seed');
  
  // State Seed Phrase
  const [mnemonic, setMnemonic] = useState<string>('');
  const [seedPassword, setSeedPassword] = useState<string>('');

  // State Keystore
  const [keystoreFile, setKeystoreFile] = useState<File | null>(null);
  const [keystoreJsonContent, setKeystoreJsonContent] = useState<string>('');
  const [keystorePassword, setKeystorePassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Handle pembacaan file Keystore JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKeystoreFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setKeystoreJsonContent(event.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  };

  const handleImportSeed = async () => {
    if (!mnemonic.trim() || !seedPassword) {
      setErrorMsg('Harap isi seed phrase dan password vault.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Panggil fungsi Go backend di step berikutnya (misal: RestoreFromMnemonic)
      console.log('Importing via seed phrase:', mnemonic);
      // Contoh hasil dummy sementara sebelum dihubungkan ke backend Go
      onWalletImported('0x71C7656EC7ab88b098defB751B7401B5f6d8976F');
    } catch (err: any) {
      setErrorMsg(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportKeystore = async () => {
    if (!keystoreJsonContent || !keystorePassword) {
      setErrorMsg('Pilih file Keystore JSON dan masukkan password yang benar.');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      // Panggil fungsi Go backend di step berikutnya (misal: RestoreFromKeystore)
      console.log('Importing via Keystore JSON');
      onWalletImported('0x63102a0614457D71b87D70A320dfC3e2840DCE34');
    } catch (err: any) {
      setErrorMsg(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '32px', borderRadius: '16px', maxWidth: '500px', margin: '0 auto', color: '#fff', textAlign: 'left' }}>
      <h2 style={{ marginTop: 0 }}>Import Existing Wallet</h2>
      
      {/* Tab Switcher */}
      <div style={{ flex: 1, display: 'flex', gap: '8px', marginBottom: '20px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px' }}>
        <button
          onClick={() => { setActiveTab('seed'); setErrorMsg(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'seed' ? '#3b82f6' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Seed Phrase
        </button>
        <button
          onClick={() => { setActiveTab('keystore'); setErrorMsg(''); }}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: activeTab === 'keystore' ? '#3b82f6' : 'transparent', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Keystore JSON
        </button>
      </div>

      {errorMsg && (
        <div style={{ backgroundColor: '#ef444422', border: '1px solid #ef4444', color: '#fca5a5', padding: '10px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
          {errorMsg}
        </div>
      )}

      {/* Tab 1: Seed Phrase */}
      {activeTab === 'seed' && (
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>12-WORD SEED PHRASE</label>
          <textarea
            rows={3}
            placeholder="Masukkan 12 kata dipisahkan dengan spasi..."
            value={mnemonic}
            onChange={(e) => setMnemonic(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'monospace' }}
          />

          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>PASSWORD VAULT BARU</label>
          <input
            type="password"
            placeholder="Password untuk mengunci aplikasi"
            value={seedPassword}
            onChange={(e) => setSeedPassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleImportSeed}
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {isLoading ? 'Importing...' : 'Restore Wallet'}
          </button>
        </div>
      )}

      {/* Tab 2: Keystore JSON */}
      {activeTab === 'keystore' && (
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>UNGGAH FILE KEYSTORE (.JSON)</label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '16px', boxSizing: 'border-box' }}
          />

          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>PASSWORD KEYSTORE</label>
          <input
            type="password"
            placeholder="Password dekripsi file Keystore"
            value={keystorePassword}
            onChange={(e) => setKeystorePassword(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', marginBottom: '20px', boxSizing: 'border-box' }}
          />

          <button
            onClick={handleImportKeystore}
            disabled={isLoading || !keystoreFile}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: '#fff', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
          >
            {isLoading ? 'Decrypting...' : 'Import Keystore'}
          </button>
        </div>
      )}

      <button
        onClick={onCancel}
        style={{ width: '100%', padding: '10px', borderRadius: '8px', backgroundColor: 'transparent', color: '#94a3b8', border: 'none', marginTop: '12px', cursor: 'pointer' }}
      >
        Batal
      </button>
    </div>
  );
};