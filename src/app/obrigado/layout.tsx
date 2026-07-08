import type { Metadata } from "next";

// Página de conversão pós-lead — não deve aparecer no Google.
export const metadata: Metadata = {
  title: "Obrigado",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ObrigadoLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
