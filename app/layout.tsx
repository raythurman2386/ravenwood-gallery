import { GeistSans } from "geist/font/sans";
import '../styles/index.css'

export const metadata = {
  title: "Gallery | Ravenwood Creations",
  description:
    "Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!",
  twitter: {
    title: "Gallery | Ravenwood Creations",
    description:
      "Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!",
    creator: "@raythurman2386",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Gallery | Ravenwood Creations",
    description:
      "Experience the craze that is AI generated art! Browse and share to your hearts content. Join and create with us!",
    siteName: "Gallery | Ravenwood Creations",
    locale: "en_US",
    type: "website",
    url: "https://www.ravenwood-gallery.vercel.app",
    images: "/og-image.png",
  },
  icons: {
    icon: "/og-image.png",
  },
  metadataBase: new URL("https://www.ravenwood-gallery.vercel.app"),
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" className={`bg-black ${GeistSans.className} antialiased`}>
      <body>{children}</body>
    </html>
  )
}