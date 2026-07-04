import React from 'react';

export const BillLinkingLinksPage: React.FC = () => {
  return React.createElement('div', {className: 'bill-linking'},
    React.createElement('h2', null, 'Bill Linking - Linked Transactions'),
    React.createElement('p', null, 'View and manage linked bill/subscription patterns.')
  );
};

export default BillLinkingLinksPage;