import React from 'react';

export const BillLinkingSuggestionsPage: React.FC = () => {
  return React.createElement('div', {className: 'bill-linking'},
    React.createElement('h2', null, 'Bill Linking'),
    React.createElement('p', null, 'Scan your transactions to detect recurring bills and subscriptions.'),
    React.createElement('p', {className: 'info'}, 'This page will show detected patterns with vendor, amount, frequency and confidence.'),
    React.createElement('button', {className: 'scan-btn'}, 'Scan Transactions')
  );
};

export default BillLinkingSuggestionsPage;