"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { HERO_COPY } from "@/data/home";
import { ArrowRight } from "lucide-react";

interface HeroProps {
    lineOne?: string;
    lineTwoPrefix?: string;
    lineTwoEmphasis?: string;
    tagline?: string;
    descriptionLead?: string;
    descriptionEmphasis?: string;
    descriptionTail?: string;
    videoUrl?: string;
}

export default function Hero({
    lineOne = HERO_COPY.lineOne,
    lineTwoPrefix = HERO_COPY.lineTwoPrefix,
    lineTwoEmphasis = HERO_COPY.lineTwoEmphasis,
    tagline = HERO_COPY.tagline,
    descriptionLead = HERO_COPY.descriptionLead,
    descriptionEmphasis = HERO_COPY.descriptionEmphasis,
    descriptionTail = HERO_COPY.descriptionTail,
    videoUrl,
}: HeroProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const syncMuted = (video: HTMLVideoElement) => {
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
    };

    useEffect(() => {
        if (!videoUrl || !videoRef.current) return;

        const attemptPlay = async () => {
            if (!videoRef.current) return;

            syncMuted(videoRef.current);

            try {
                await videoRef.current.play();
            } catch {
                // Autoplay can be blocked by the browser; ignore silently.
            }
        };

        attemptPlay();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        void attemptPlay();
                    }
                });
            },
            { threshold: 0.25 },
        );

        observer.observe(videoRef.current);

        return () => {
            observer.disconnect();
        };
    }, [videoUrl]);

    return (
        <section
            id="hero"
            className="relative min-h-screen w-full overflow-hidden bg-black"
        >
            {/* Background Image */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <Image
                    src="/images/Test.png"
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover object-center lg:pr-38 lg:object-contain lg:object-right"
                    quality={100}
                />
                {/* Gradient overlays for text readability */}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Optional video background */}
            {videoUrl && (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedMetadata={() => {
                        if (!videoRef.current) return;
                        syncMuted(videoRef.current);
                        void videoRef.current.play();
                    }}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover opacity-10 grayscale"
                    src={videoUrl}
                />
            )}

            {/* Subtle ambient gradient */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.03) 0%, transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.015) 0%, transparent 50%)",
                }}
            />

            {/* Main content */}
            <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 py-32 lg:px-12">

                {/* Left — text content */}
                <div className="flex max-w-2xl flex-col items-start text-left">

                    {/* Display name */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-10px" }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h1
                            className="text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[1.1] tracking-tight text-white"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            {lineOne} <br />
                            {lineTwoPrefix}{" "}
                            <span className="italic font-light text-white/90" style={{ fontFamily: "var(--font-fraunces)" }}>
                                {lineTwoEmphasis}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-10px" }}
                        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-7 text-lg font-medium tracking-wide text-white/90 sm:text-xl md:text-2xl"
                    >
                        {tagline}
                    </motion.p>

                    {/* Bio + stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-10px" }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-8 max-w-xl"
                    >
                        <p className="text-base leading-8 text-white/80 sm:text-lg">
                            {descriptionLead}{" "}
                            <strong className="font-bold text-white">{descriptionEmphasis}</strong>{" "}
                            {descriptionTail}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: "-10px" }}
                        transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-10 flex flex-col gap-4 sm:flex-row"
                    >
                        <a
                            href="/contact"
                            className="group w-fit inline-flex items-center gap-3 rounded-full border border-white/15 bg-gradient-to-b from-[#242424] to-[#111111] px-6 py-3 text-base font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:from-[#2a2a2a] hover:to-[#151515]"
                        >
                            <span>Hire Me</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 transition-all duration-300 group-hover:bg-white">
                                <ArrowRight
                                    size={16}
                                    className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-black"
                                    strokeWidth={2.5}
                                />
                            </span>
                        </a>
                        <a
                            href="/cv.pdf"
                            download="Achmad Dafa Rizqullah-CV.pdf"
                            className="group w-fit inline-flex items-center gap-3 rounded-full border border-white/15 bg-gradient-to-b from-[#242424] to-[#111111] px-6 py-3 text-base font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:from-[#2a2a2a] hover:to-[#151515]"
                        >
                            <span>Download CV</span>
                            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 transition-all duration-300 group-hover:bg-white">
                                <ArrowRight
                                    size={16}
                                    className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-black"
                                    strokeWidth={2.5}
                                />
                            </span>
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 z-10"
            >
                <span className="text-[10px] font-light uppercase tracking-[0.3em] text-white/40">
                    Scroll
                </span>
                <div className="flex h-8 w-[1px] flex-col items-center overflow-hidden">
                    <div className="h-3 w-[1px] animate-scroll-indicator bg-white/40" />
                </div>
            </motion.div>
        </section>
    );
}
