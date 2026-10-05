import React, { useState } from 'react';
import { ValidateAddress } from '../../wailsjs/go/main/App';

interface AddressSearchBarProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export const AddressSearchBar: React.FC<AddressSearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    setAddress(val);

    if (!val) {
      setIsValid(null);
      setErrorMessage('');
      return;
    }

    try {
      const valid = await ValidateAddress(val);
      setIsValid(valid);
      if (!valid) {
        setErrorMessage('Invalid Ethereum address! Must start with 0x followed by 40 hex characters.');
      } else {
        setErrorMessage('');
      }
    } catch (err) {
      setIsValid(false);
      setErrorMessage('Failed to validate address.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && address) {
      onSearch(address);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto 24px auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type="text"
            value={address}
            onChange={handleInputChange}
            placeholder="Enter ETH Address (0x...)"
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: `2px solid ${
                isValid === null ? '#334155' : isValid ? '#10b981' : '#ef4444'
              }`,
              backgroundColor: '#1e293b',
              color: '#f8fafc',
              fontSize: '15px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: isValid && !isLoading ? '#3b82f6' : '#475569',
            color: '#ffffff',
            fontWeight: '600',
            fontSize: '15px',
            cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease',
          }}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {errorMessage && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', textAlign: 'left' }}>
          ❌ {errorMessage}
        </p>
      )}
      {isValid && (
        <p style={{ color: '#10b981', fontSize: '13px', marginTop: '6px', textAlign: 'left' }}>
          ✅ Valid Ethereum address format
        </p>
      )}
    </div>
  );
};