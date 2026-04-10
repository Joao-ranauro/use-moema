"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

export default function ObrigadoPage() {
  useEffect(() => {
    const fireLeadEvent = () => {
      if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead");
        return true;
      }
      return false;
    };

    if (!fireLeadEvent()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (fireLeadEvent() || attempts >= 50) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center noise-strong">
      <motion.div
        className="flex flex-col items-center justify-center px-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/logos/use-moema-branco.svg"
          alt="use.moema"
          width={160}
          height={36}
          className="mb-10"
          priority
        />

        <h1 className="text-h1 text-white">Obrigado.</h1>

        <p className="text-body text-white/40 mt-4 max-w-sm">
          Nossa equipe entrará em contato em breve.
        </p>

        <Link
          href="/"
          className="relative mt-12 inline-flex items-center gap-2 px-8 py-3 border border-white/20 text-white text-caption tracking-widest uppercase overflow-hidden transition-colors hover:border-white/40 btn-mask"
        >
          <span className="relative z-10">Voltar ao site</span>
          <svg
            className="relative z-10 w-4 h-4"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
