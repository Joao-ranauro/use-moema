"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

const TYPOLOGIES = [
  { type: "Studio", area: "20", unit: "m²" },
  { type: "1 Dormitório", area: "35", unit: "m²" },
  { type: "1 Dormitório Plus", area: "42", unit: "m²" },
  { type: "Double Suite", area: "56", unit: "m²" },
];

export function ResidencesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      // GPU-accelerated counter-scale reveal
      // Outer wrapper scales 0.87→1 (expands visible frame)
      // Inner wrapper counter-scales 1.15→1 (keeps image visually stable)
      if (imageWrapperRef.current && imageInnerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: imageWrapperRef.current,
            start: "top 80%",
            end: "top 20%",
            scrub: 1.5,
          },
        });

        tl.fromTo(
          imageWrapperRef.current,
          { scale: 0.87 },
          { scale: 1, ease: "none" },
          0
        );

        tl.fromTo(
          imageInnerRef.current,
          { scale: 1.15 },
          { scale: 1, ease: "none" },
          0
        );
      }

      // Typology rows stagger
      const rows = sectionRef.current.querySelectorAll(".typo-row");
      gsap.fromTo(
        rows,
        { opacity: 0, x: 60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rows[0],
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="residencias" className="relative bg-white">
      {/* Full-bleed image with GPU-accelerated scale reveal */}
      <div
        ref={imageWrapperRef}
        className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden"
      >
        <div
          ref={imageInnerRef}
          className="relative w-full h-full"
        >
          <Image
            src="/images/residences/fachada.webp"
            alt="Fachada do use.moema — prédio boutique de studios e compactos na Alameda dos Anapurus, Moema, São Paulo"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1920px"
            priority
          />
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 pt-24 md:pt-32 pb-24 md:pb-32">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left — Statement */}
          <div className="lg:col-span-5">
            <p className="text-caption text-black/30 mb-6">Residências</p>
            <h2 className="text-h1 text-black">
              De 20 a 56 m².
              <br />
              <span className="text-black/25">Cada um com propósito.</span>
            </h2>
            <p className="text-body text-black/45 mt-8 max-w-sm">
              Quatro tipologias pensadas para quem vive de verdade em espaços
              compactos. Sem desperdício, sem concessão.
            </p>
            <p className="text-caption text-black/20 mt-8">
              100% R2V — Perfil exclusivamente residencial
            </p>
          </div>

          {/* Right — Typology list, editorial style */}
          <div className="lg:col-span-7 lg:pt-4">
            {TYPOLOGIES.map((t, i) => (
              <motion.div
                key={`${t.type}-${t.area}`}
                className="typo-row group flex items-baseline justify-between border-t border-steel-10 py-6 md:py-8 cursor-default"
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="text-caption text-black/20 w-6">
                    0{i + 1}
                  </span>
                  <h3 className="text-h3 text-black font-normal">{t.type}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-h1 text-black font-extralight">
                    {t.area}
                  </span>
                  <span className="text-caption text-black/30">{t.unit}</span>
                </div>
              </motion.div>
            ))}
            <div className="border-t border-steel-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
