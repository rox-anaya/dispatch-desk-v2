import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Dispatch Desk V2',
  description: 'Flight Dispatch Platform for Infinite Flight',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">{props.children}</body>
    </html>
  );
}
