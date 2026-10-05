import React from 'react';
import { Skeleton } from './Skeleton';

interface BalanceCardProps {
  address: string;
  balance: string;
  isLoading: boolean;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({ address, balance, isLoading }) => {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #334155',
        marginBottom: '24px',
        textAlign: 'left',
      }}
    >
      <h3
        style={{
          fontSize: '12px',
          color: '#94a3b8',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Wallet Address
      </h3>
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '15px',
          color: '#38bdf8',
          wordBreak: 'break-all',
          margin: '0 0 20px 0',
        }}
      >
        {address}
      </p>

      <h3
        style={{
          fontSize: '12px',
          color: '#94a3b8',
          margin: '0 0 8px 0',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Native ETH Balance
      </h3>

      <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f8fafc', height: '40px' }}>
        {isLoading ? (
          <Skeleton width="180px" height="38px" borderRadius="8px" />
        ) : (
          `${balance} ETH`
        )}
      </div>
    </div>
  );
};