import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

import { Providers } from "@/context/ReduxProvider";
// import { PersistGate } from "redux-persist/integration/react";
// import Navbar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClubSync",
  description: "A platform for managing clubs and events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <Provider store={store}> */}
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ThemeProvider attribute="class">
          <AuthProvider>
            <Providers>{children}</Providers>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
        {/* </PersistGate> */}
        {/* </Provider> */}
      </body>
    </html>
  );
}
