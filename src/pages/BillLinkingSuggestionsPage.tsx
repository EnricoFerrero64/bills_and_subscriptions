import React, { useState, useCallback } from 'react';
import * as Linker from '../lib/linker';

interface BillLinkingSuggestionsPageProps {
  transactions: Linker.Transaction[];
}

export const BillLinkingSuggestionsPage: React.FC<BillLinkingSuggestionsPageProps> = ({
  transactions,
}) => {
  const [suggestions, setSuggestions] = useState<Linker.Suggestion[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(() => {
    setError(null);
    try {
      const patterns = Linker.detectRecurringPatterns(transactions);
      const suggestionsList = Linker.getSuggestions(patterns);
      setSuggestions(suggestionsList);
      setHasScanned(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed');
    }
  }, [transactions]);

  const handleDismiss = useCallback(
    (patternId: string) => {
      setSuggestions(prev => prev.filter(s => s.patternId !== patternId));
    },
    [],
  );

  return (
    <div className="bill-linking-suggestions">
      <h2>Bill Linking - Suggestions</h2>

      <div className="scan-controls">
        <button onClick={handleScan} disabled={hasScanned}>
          {hasScanned ? 'Scanned' : 'Scan Transactions'}
        </button>
        {error && <p className="error-text">{error}</p>}
      </div>

      {hasScanned && suggestions.length === 0 && (
        <p>No recurring patterns found.</p>
      )}

      {suggestions.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Amount</th>
              <th>Frequency</th>
              <th>Confidence</th>
              <th>Last Seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map(s => (
              <tr key={s.patternId} className={s.isDismissed ? 'dismissed' : ''}>
                <td>{s.vendor}</td>
                <td>{s.amount.toFixed(2)}</td>
                <td>{s.frequency}</td>
                <td>{s.confidence}%</td>
                <td>{s.lastSeen}</td>
                <td>
                  <button onClick={() => handleDismiss(s.patternId)}>Dismiss</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillLinkingSuggestionsPage;