import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/context/ReduxProvider";

// import { Providers } from "@/context/ReduxProvider";
// import { PersistGate } from "redux-persist/integration/react";
// import Navbar from "@/components/NavBar";

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
        className={`antialiased`}
      >
        {/* <Provider store={store}> */}
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
