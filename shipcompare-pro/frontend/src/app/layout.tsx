import { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'ShipCompare Pro - Smart Shipping, Better Prices',
  description: 'Compare rates from all major carriers and unlock exclusive consolidated shipping discounts up to 50% off retail prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
