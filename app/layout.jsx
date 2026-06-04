import "./globals.css";

export const metadata = {
  title: "Tokyo Hibachi | Japanese & Hibachi Restaurant in Ithaca, NY",
  description:
    "Tokyo Hibachi is a Japanese, hibachi, and Asian restaurant in Ithaca NY serving sizzling hibachi dinners, sushi-inspired favorites, and online reservations.",
  openGraph: {
    title: "Tokyo Hibachi | Japanese & Hibachi Restaurant in Ithaca, NY",
    description:
      "Reserve a table at Tokyo Hibachi in Ithaca, NY for Japanese hibachi, Asian dining, and warm hospitality.",
    url: "https://tokyo-hibachi.vercel.app",
    siteName: "Tokyo Hibachi",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
