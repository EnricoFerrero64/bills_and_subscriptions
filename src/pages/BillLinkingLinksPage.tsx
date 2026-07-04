import React, { useEffect, useState } from 'react';
import * as Linker from '../lib/linker';
import * as Storage from '../lib/linker-storage';

export const BillLinkingLinksPage: React.FC = () => {
  const [links, setLinks] = useState<Storage.LinkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = () => {
    const all = Linker.getAllLinks();
    setLinks(all);
    setLoading(false);
  };

  const handleUnlink = (linkId: string) => {
    Linker.unlinkTransaction(linkId);
    setLinks(prev => prev.filter(l => l.id !== linkId));
  };

  if (loading) return <div className="bill-linking-links">Loading linked records...</div>;

  return (
    <div className="bill-linking-links">
      <h2>Bill Linking - Linked Transactions</h2>

      {links.length === 0 && <p>No transactions linked to patterns yet.</p>}

      {links.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Pattern ID</th>
              <th>Transaction ID</th>
              <th>Linked At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link.id}>
                <td>{link.patternId}</td>
                <td>{link.transactionId}</td>
                <td>{link.linkedAt}</td>
                <td>
                  <button onClick={() => handleUnlink(link.id)}>Unlink</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BillLinkingLinksPage;