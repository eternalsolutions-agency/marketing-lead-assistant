import './globals.css';

export const metadata = {
  title: 'Marketing Lead Assistant',
  description: 'CRM personale con AI per gestione lead e messaggi commerciali',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
