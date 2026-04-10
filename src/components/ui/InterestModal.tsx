"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { submitLead } from "@/lib/leads";
import { event as fbEvent } from "@/lib/facebook-pixel";

/* ─── Types ─── */
interface InterestModalProps {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  motivation: string[];
  budget: string;
}

/* ─── Constants ─── */
const STEPS = [
  { id: "contact", label: "Contato" },
  { id: "motivation", label: "Intenção de compra" },
  { id: "budget", label: "Investimento" },
] as const;

const MOTIVATIONS = [
  { value: "moradia", label: "Moradia" },
  { value: "investimento", label: "Investimento" },
] as const;

/* ─── Phone mask helper ─── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const BUDGETS = [
  { value: "ate-500k", label: "Até R$ 500 mil" },
  { value: "500k-1m", label: "R$ 500 mil a R$ 1 milhão" },
  { value: "1m-1.5m", label: "R$ 1 milhão a R$ 1,5 milhão" },
  { value: "acima-1.5m", label: "Acima de R$ 1,5 milhão" },
] as const;

/* ─── Animation variants ─── */
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 },
  },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2 },
  }),
};

/* ─── Component ─── */
export function InterestModal({ open, onClose }: InterestModalProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      motivation: [],
      budget: "",
    },
  });

  const motivation = watch("motivation");
  const budget = watch("budget");

  // Mount check for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll lock + ESC
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
    // Reset after close animation
    setTimeout(() => {
      setStep(0);
      setDirection(1);
      setSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(null);
      reset();
    }, 300);
  }, [onClose, reset]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleClose]);

  // Navigation
  const next = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Toggle motivation (multi-select)
  const toggleMotivation = (value: string) => {
    const current = motivation || [];
    if (current.includes(value)) {
      setValue(
        "motivation",
        current.filter((m) => m !== value)
      );
    } else {
      setValue("motivation", [...current, value]);
    }
  };

  // Step validation
  const isStepValid = () => {
    switch (step) {
      case 0:
        return (
          watch("name").trim() !== "" &&
          watch("email").trim() !== "" &&
          watch("phone").trim() !== ""
        );
      case 1:
        return (motivation?.length || 0) > 0;
      case 2:
        return budget !== "";
      default:
        return true;
    }
  };

  // Submit
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitLead({
      source: "modal_interesse",
      name: data.name,
      email: data.email,
      phone: data.phone,
      motivation: data.motivation,
      budget: data.budget,
    });

    setIsSubmitting(false);

    if (result.success) {
      fbEvent("CompleteRegistration");
      onClose();
      setTimeout(() => {
        window.location.href = "/obrigado";
      }, 300);
    } else {
      setSubmitError(result.error ?? "Erro ao enviar. Tente novamente.");
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-lg bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-10 flex h-8 w-8 items-center justify-center text-white/40 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success state */
                <motion.div
                  key="success"
                  className="flex flex-col items-center justify-center py-20 px-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Image
                    src="/logos/use-moema-branco.svg"
                    alt="use.moema"
                    width={140}
                    height={32}
                    className="mb-8"
                  />
                  <h3 className="text-h1 text-white">Obrigado.</h3>
                  <p className="text-body text-white/40 mt-4 text-center max-w-xs">
                    Nossa equipe entrará em contato em breve.
                  </p>
                </motion.div>
              ) : (
                /* Form */
                <motion.div key="form">
                  {/* Progress indicator */}
                  <div className="px-8 pt-8 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      {STEPS.map((s, i) => (
                        <div key={s.id} className="flex items-center gap-3">
                          <div
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              i < step
                                ? "bg-white"
                                : i === step
                                  ? "bg-white ring-4 ring-white/10"
                                  : "bg-white/15"
                            }`}
                          />
                          {i < STEPS.length - 1 && (
                            <div className="h-px w-8 bg-white/10" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-caption text-white/25 mt-3">
                      {step + 1} de {STEPS.length} — {STEPS[step].label}
                    </p>
                  </div>

                  {/* Step content */}
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="px-8 py-6 min-h-[320px]">
                      <AnimatePresence mode="wait" custom={direction}>
                        {/* Step 1: Contact */}
                        {step === 0 && (
                          <motion.div
                            key="step-0"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div>
                              <h3 className="text-h3 text-white mb-1">
                                Seus dados
                              </h3>
                              <p className="text-sm text-white/30">
                                Para entrarmos em contato.
                              </p>
                            </div>

                            <div className="space-y-5">
                              <div>
                                <input
                                  {...register("name", {
                                    required: "Nome é obrigatório",
                                  })}
                                  placeholder="Nome"
                                  className="w-full bg-transparent border-b border-white/10 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-white focus:outline-none transition-colors duration-500"
                                />
                                {errors.name && (
                                  <p className="text-xs text-red-400 mt-1.5">
                                    {errors.name.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  {...register("email", {
                                    required: "E-mail é obrigatório",
                                    pattern: {
                                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                      message: "E-mail inválido",
                                    },
                                  })}
                                  type="email"
                                  placeholder="E-mail"
                                  className="w-full bg-transparent border-b border-white/10 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-white focus:outline-none transition-colors duration-500"
                                />
                                {errors.email && (
                                  <p className="text-xs text-red-400 mt-1.5">
                                    {errors.email.message}
                                  </p>
                                )}
                              </div>
                              <div>
                                <input
                                  {...register("phone", {
                                    required: "Telefone é obrigatório",
                                    pattern: {
                                      value: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
                                      message: "Formato: (11) 99999-9999",
                                    },
                                  })}
                                  type="tel"
                                  placeholder="Telefone"
                                  maxLength={15}
                                  onChange={(e) => {
                                    const formatted = formatPhone(e.target.value);
                                    setValue("phone", formatted, { shouldValidate: !!errors.phone });
                                  }}
                                  className="w-full bg-transparent border-b border-white/10 py-3.5 text-sm text-white placeholder:text-white/25 focus:border-white focus:outline-none transition-colors duration-500"
                                />
                                {errors.phone && (
                                  <p className="text-xs text-red-400 mt-1.5">
                                    {errors.phone.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Motivation */}
                        {step === 1 && (
                          <motion.div
                            key="step-1"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div>
                              <h3 className="text-h3 text-white mb-1">
                                Qual sua intenção de compra?
                              </h3>
                              <p className="text-sm text-white/30">
                                Selecione uma ou ambas as opções.
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {MOTIVATIONS.map((m) => {
                                const selected = motivation?.includes(m.value);
                                return (
                                  <button
                                    key={m.value}
                                    type="button"
                                    onClick={() => toggleMotivation(m.value)}
                                    className={`relative flex flex-col items-center justify-center py-10 border rounded-xl transition-all duration-300 cursor-pointer ${
                                      selected
                                        ? "border-white bg-white/8 text-white"
                                        : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/60"
                                    }`}
                                  >
                                    <span className="text-h3 font-light">
                                      {m.label}
                                    </span>
                                    {selected && (
                                      <motion.div
                                        className="absolute top-3 right-3"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                          type: "spring",
                                          stiffness: 500,
                                          damping: 30,
                                        }}
                                      >
                                        <svg
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M3 8.5l3.5 3.5L13 4"
                                            stroke="white"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </motion.div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Budget */}
                        {step === 2 && (
                          <motion.div
                            key="step-2"
                            custom={direction}
                            variants={stepVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="space-y-6"
                          >
                            <div>
                              <h3 className="text-h3 text-white mb-1">
                                Faixa de investimento
                              </h3>
                              <p className="text-sm text-white/30">
                                Selecione o valor planejado.
                              </p>
                            </div>

                            <div className="space-y-2.5">
                              {BUDGETS.map((b) => {
                                const selected = budget === b.value;
                                return (
                                  <button
                                    key={b.value}
                                    type="button"
                                    onClick={() => setValue("budget", b.value)}
                                    className={`w-full flex items-center px-5 py-4 border rounded-xl transition-all duration-300 cursor-pointer text-left ${
                                      selected
                                        ? "border-white bg-white/8 text-white"
                                        : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/60"
                                    }`}
                                  >
                                    <div
                                      className={`h-3 w-3 rounded-full border mr-4 flex-shrink-0 transition-all duration-300 ${
                                        selected
                                          ? "border-white bg-white"
                                          : "border-white/25"
                                      }`}
                                    />
                                    <span className="text-sm font-medium">
                                      {b.label}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Error banner */}
                    {submitError && (
                      <div className="mx-8 mb-2">
                        <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded px-4 py-3">
                          {submitError}
                        </p>
                      </div>
                    )}

                    {/* Footer buttons */}
                    <div className="flex items-center justify-between px-8 pb-8 pt-2">
                      <button
                        type="button"
                        onClick={prev}
                        disabled={step === 0}
                        className={`text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer ${
                          step === 0
                            ? "opacity-0 pointer-events-none"
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        ← Voltar
                      </button>

                      {step < STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={next}
                          disabled={!isStepValid()}
                          className={`group relative overflow-hidden inline-flex items-center justify-center border px-8 py-3.5 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer ${
                            isStepValid()
                              ? "border-white/30 text-white hover:bg-white hover:text-black"
                              : "border-white/10 text-white/20 cursor-not-allowed"
                          }`}
                        >
                          Próximo →
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={!isStepValid() || isSubmitting}
                          className={`group relative overflow-hidden inline-flex items-center justify-center border px-8 py-3.5 text-xs font-medium tracking-[0.08em] uppercase transition-all duration-300 cursor-pointer ${
                            isStepValid() && !isSubmitting
                              ? "border-white/30 text-white hover:bg-white hover:text-black"
                              : "border-white/10 text-white/20 cursor-not-allowed"
                          }`}
                        >
                          {isSubmitting ? "Enviando..." : "Enviar →"}
                        </button>
                      )}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
