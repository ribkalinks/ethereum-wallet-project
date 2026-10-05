import React from 'react';
import { ethclient } from '../../wailsjs/go/models';
import { Skeleton } from './Skeleton';

interface TransactionTableProps {
  transactions: ethclient.Transaction[];
  isLoading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, isLoading }) => {
  // Skeleton Loading Rows
  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '20px',
          textAlign: 'left',
        }}
      >
        <Skeleton width="200px" height="24px" borderRadius="6px" />
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Skeleton height="40px" borderRadius="8px" />
          <Skeleton height="40px" borderRadius="8px" />
          <Skeleton height="40px" borderRadius="8px" />
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '12px',
          border: '1px solid #334155',
          padding: '32px 20px',
          color: '#94a3b8',
          textAlign: 'center',
        }}
      >
        No transaction history found for this address.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        borderRadius: '12px',
        border: '1px solid #334155',
        overflow: 'hidden',
        textAlign: 'left',
      }}
    >
      <h3
        style={{
          fontSize: '16px',
          color: '#f8fafc',
          padding: '16px 20px',
          borderBottom: '1px solid #334155',
          margin: 0,
        }}
      >
        Recent Transaction History
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#0f172a', color: '#94a3b8', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px' }}>Tx Hash</th>
              <th style={{ padding: '12px 20px' }}>Status</th>
              <th style={{ padding: '12px 20px' }}>From</th>
              <th style={{ padding: '12px 20px' }}>To</th>
              <th style={{ padding: '12px 20px' }}>Value (ETH)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, idx) => {
              const isSuccess = tx.isError === '0';

              return (
                <tr key={tx.hash || idx} style={{ borderBottom: '1px solid #334155' }}>
                  <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: '#60a5fa' }}>
                    {tx.hash ? `${tx.hash.substring(0, 10)}...` : '-'}
                  </td>
                  <td style={{ padding: '12px 20px' }}>
                    {/* Status Badge */}
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: isSuccess ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: isSuccess ? '#10b981' : '#ef4444',
                        border: `1px solid ${isSuccess ? '#10b981' : '#ef4444'}`,
                        display: 'inline-block',
                      }}
                    >
                      {isSuccess ? 'Success' : 'Failed'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {tx.from ? `${tx.from.substring(0, 8)}...` : '-'}
                  </td>
                  <td style={{ padding: '12px 20px', fontFamily: 'monospace', color: '#cbd5e1' }}>
                    {tx.to ? `${tx.to.substring(0, 8)}...` : 'Contract Creation'}
                  </td>
                  <td style={{ padding: '12px 20px', fontWeight: 'bold', color: '#34d399' }}>
                    {tx.valueEth} ETH
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};