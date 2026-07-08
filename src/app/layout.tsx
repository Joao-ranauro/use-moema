import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Analytics } from "@vercel/analytics/next";
import { FB_PIXEL_ID } from "@/lib/facebook-pixel";
import { AMENITIES } from "@/lib/constants";

const SITE_URL = "https://usemoema.com.br";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: "use.moema — Studios e Compactos Sofisticados em Moema, São Paulo",
    template: "%s | use.moema",
  },
  description:
    "Prédio boutique em Moema: studios e compactos premium de 20 a 56 m². 53 unidades, a 900 m do Metrô Moema e 1,8 km do Parque Ibirapuera. Entrega em dezembro de 2027.",
  keywords: [
    "use.moema",
    "apartamento Moema",
    "studio Moema",
    "studio em Moema",
    "apartamento compacto Moema",
    "lançamento Moema",
    "compacto premium São Paulo",
    "investimento imobiliário",
    "prédio boutique",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "use.moema — Studios e Compactos Sofisticados em Moema, São Paulo",
    description:
      "Prédio boutique em Moema com studios e compactos premium de 20 a 56 m², pensados para uso real. Entrega em dezembro de 2027.",
    type: "website",
    url: SITE_URL,
    siteName: "use.moema",
    locale: "pt_BR",
    images: [
      {
        url: "/og/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fachada do use.moema — prédio boutique de studios e compactos em Moema, São Paulo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "use.moema — Studios e Compactos Sofisticados em Moema, São Paulo",
    description:
      "Prédio boutique em Moema com studios e compactos premium de 20 a 56 m², pensados para uso real. Entrega em dezembro de 2027.",
    images: ["/og/og-image.jpg"],
  },
};

// Dados estruturados (JSON-LD) — Google entende a página como um
// empreendimento residencial em Moema. Só dados canônicos do RAG.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "ApartmentComplex",
  name: "use.moema",
  description:
    "Prédio boutique residencial com 53 studios e compactos premium de 20 a 56 m², em 14 pavimentos, em Moema, São Paulo. Conclusão prevista para dezembro de 2027.",
  url: SITE_URL,
  image: `${SITE_URL}/og/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Alameda dos Anapurus, 1216",
    addressLocality: "São Paulo",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  numberOfAccommodationUnits: {
    "@type": "QuantitativeValue",
    value: 53,
  },
  amenityFeature: AMENITIES.map((a) => ({
    "@type": "LocationFeatureSpecification",
    name: a.title,
    value: true,
  })),
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
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
        <Analytics />
      </body>
    </html>
  );
}
