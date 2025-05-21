import type { Metadata } from "next";
import localFont from 'next/font/local'; // Import for local fonts

import "./globals.css";

const radioGrotesk = localFont({
  variable: "--font-radio-grotesk",
  src: '../../public/fonts/PPRadioGrotesk-Regular.otf',
  display: 'swap',
});


export const metadata: Metadata = {
  title: "Skye Interactive",
  description: "Skye Interactive",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={radioGrotesk.variable}>
      <head>
        
      </head>
      <body
        className="antialiased"
      >
        
        {children}
      </body>
    </html>
  );
}
