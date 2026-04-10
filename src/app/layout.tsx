import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { FB_PIXEL_ID } from "@/lib/facebook-pixel";

const inter = localFont({
  src: [
    {
      path: "../fonts/InterVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "use.moema — Compactos Sofisticados da Nova Geração",
  description:
    "Prédio boutique em Moema com studios e compactos premium de 20 a 56 m². 53 unidades, 14 pavimentos. A 1,8 km do Parque Ibirapuera. Entrega dezembro 2027.",
  keywords: [
    "use.moema",
    "apartamento Moema",
    "studio Moema",
    "compacto premium São Paulo",
    "investimento imobiliário",
    "prédio boutique",
  ],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "use.moema — Compactos Sofisticados da Nova Geração",
    description:
      "Prédio boutique em Moema com studios e compactos premium pensados para uso real.",
    type: "website",
    locale: "pt_BR",
  },
};

const FB_PIXEL_SCRIPT = FB_PIXEL_ID
  ? `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${FB_PIXEL_ID}');fbq('track','PageView');`
  : null;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {FB_PIXEL_SCRIPT && (
          <>
            <script dangerouslySetInnerHTML={{ __html: FB_PIXEL_SCRIPT }} />
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
