import { AuthProvider } from '../contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ 
        fontFamily: 'system-ui, -apple-system, sans-serif', 
        margin: 0, 
        padding: 0,
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}