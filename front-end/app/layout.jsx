import { Outfit } from 'next/font/google';
import { AuthProvider } from '@/app/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import '@/app/styles/globals.css';

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Alcohol Control POS System',
  description: 'Smart Alcohol Consumption Control System for regulated daily purchase limits',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={outfit.variable}>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '8px',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
        <div id="recaptcha-container"></div>
      </body>
    </html>
  );
}