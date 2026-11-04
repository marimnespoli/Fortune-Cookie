import type { Metadata, Viewport } from "next";
import { Courier_Prime, Geist, Geist_Mono, Inter, Shojumaru } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const shojumaru = Shojumaru({
  variable: "--font-shojumaru",
  weight: "400",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fortune Cookie",
  description: "Crack a cookie and get a fortune written just for you.",
  // Lets people add it to the iPhone home screen and open it like an app.
  appleWebApp: {
    capable: true,
    title: "Fortune Cookie",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2254",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${courierPrime.variable} ${shojumaru.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="phone-shell">
          <div className="phone-frame">
            <div className="phone-screen">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
