'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import '@/index.css';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link
          rel="icon"
          type="image/svg+xml"
          href="/vipka-logo.svg"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>VIPKA Club Admin</title>
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={200}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
