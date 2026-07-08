"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current || !videoRef.current) return;

      gsap.to(videoRef.current, {
        scale: 1.1,
        opacity: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100dvh] items-end overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        style={{ willChange: "transform" }}
      >
        <source src="/videos/hero.webm" type="video/webm" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 md:px-12 md:pb-24">
        <motion.div
          className="max-w-2xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2, delayChildren: 0.5 } },
          }}
        >
          <motion.h1
            className="relative h-[3.5rem] w-[280px] md:h-[5rem] md:w-[400px]"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            <Image
              src="/logos/use-moema-branco.svg"
              alt="use.moema"
              fill
              className="object-contain object-left"
              priority
            />
            <span className="sr-only">
              use.moema — studios e compactos sofisticados em Moema, São Paulo
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-h3 font-light text-white/80"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            O auge da sofisticação dos compactos.
          </motion.p>

          <motion.p
            className="mt-2 text-caption text-white/50"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              },
            }}
          >
            Moema, São Paulo — 100% R2V
          </motion.p>
        </motion.div>

      </div>
    </section>
  );
}
