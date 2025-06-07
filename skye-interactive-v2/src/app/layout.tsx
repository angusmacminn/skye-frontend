import type { Metadata } from "next";
import localFont from 'next/font/local'; // Import for local fonts
import "./globals.css";
import { ApolloWrapper } from "./apollo-provider";
import LenisProvider from "@/components/LenisProvider";

// Setup Radio Grotesk
const radioGrotesk = localFont({
  variable: "--font-radio-grotesk", // CSS variable name
  src: '../../public/fonts/PPRadioGrotesk-Regular.otf', // Path from .next/static/css/app/layout.css
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Skye Interactive Test",
  description: "Testing Skye Interactive Features",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  


  return (
    <html lang="en" className={radioGrotesk.variable}>
      <body className="antialiased">
        <LenisProvider />
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
