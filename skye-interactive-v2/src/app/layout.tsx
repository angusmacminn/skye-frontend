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
  title: "Skye Interactive",
  description: "Skye Interactive is a web development studio that specializes in creating custom websites and web applications for businesses and organizations.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  


  return (
    <html lang="en" className={radioGrotesk.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Skye Interactive is a web development studio that specializes in creating custom websites and web applications for businesses and organizations." />
        <meta name="keywords" content="web development, web design, web development services, web design services, web development company, web design company, web development agency, web design agency, web development studio, web design studio, web development agency, web design agency, web development studio, web design studio" />
        <meta name="author" content="Skye Interactive" />
      </head>
      <body className="antialiased">
        <LenisProvider />
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
