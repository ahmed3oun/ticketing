import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { AuthProvider } from "@/app/context/auth-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Ticketing App",
    template: "%s | Ticketing App",
  },
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-[family-name:var(--font-inter)`}
      >
        <div>
          <AuthProvider>
            <Header />
            <main className="container mx-auto mt-8 flex min-h-screen max-w-7xl justify-center">
              {children}
            </main>
          </AuthProvider>
          <Footer />
        </div>
      </body>

    </html>
  );
}
