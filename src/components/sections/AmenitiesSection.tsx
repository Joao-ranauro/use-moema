"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AMENITIES } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

interface AmenitiesSectionProps {
  onInterestClick: () => void;
}

export function AmenitiesSection({ onInterestClick }: AmenitiesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !trackRef.current) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = trackRef.current!;
        const totalWidth = track.scrollWidth - window.innerWidth;

        gsap.to(track, {
          x: -totalWidth,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="amenidades"
      className="relative bg-white overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-24 pb-10 md:px-12 md:pt-32 md:pb-14 lg:pt-0 lg:pb-0 lg:absolute lg:top-12 lg:left-0 lg:right-0 lg:z-20 lg:px-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-caption text-black/25 mb-3">Áreas Comuns</p>
            <h2 className="text-h2 text-black">
              O que você<br className="hidden md:block" /> realmente usa.
            </h2>
          </div>
          <p className="text-caption text-black/20 hidden lg:block">
            Arraste para explorar →
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-4 px-6 pb-24 md:px-12
                   lg:flex-row lg:gap-0 lg:px-0 lg:pb-0 lg:h-screen lg:items-end"
      >
        {AMENITIES.map((amenity, i) => (
          <div
            key={amenity.title}
            className={`group relative flex-shrink-0 overflow-hidden cursor-default
                       lg:w-[40vw] lg:h-[75vh]
                       ${i === 0 ? "lg:ml-12" : ""} ${i === AMENITIES.length - 1 ? "lg:mr-12" : ""}`}
          >
            <div className="relative aspect-[3/4] w-full lg:aspect-auto lg:h-full overflow-hidden">
              <Image
                src={amenity.image}
                alt={`${amenity.title} do use.moema — ${amenity.description}`}
                fill
                className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="text-caption text-white/30 block mb-2">0{i + 1}</span>
              <h3 className="text-h2 text-white font-light">{amenity.title}</h3>
              <p className="text-sm text-white/40 mt-3 max-w-xs leading-relaxed">
                {amenity.description}
              </p>
            </div>

            {i < AMENITIES.length - 1 && (
              <div className="hidden lg:block absolute top-0 right-0 w-px h-full bg-white/5" />
            )}
          </div>
        ))}
        <div className="flex-shrink-0 flex items-center justify-center px-6 py-12 lg:w-[40vw] lg:h-[75vh] lg:mr-12">
          <button
            onClick={onInterestClick}
            className="border border-black px-10 py-3.5 text-xs font-medium tracking-[0.08em] uppercase text-black hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Tenho Interesse
          </button>
        </div>
      </div>
    </section>
  );
}
