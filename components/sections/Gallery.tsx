"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { Project } from "@/types";
import { urlFor, isSanityConfigured } from "@/lib/sanity";
import { AnimatePresence, motion } from "framer-motion";
import { WORK_CATEGORIES_ORDER } from "@/data/home";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface SelectedWorksProps {
    projects: Project[];
}

interface VisualProjectCarouselProps {
    project: Project;
    fallbackUrl: string;
    priority?: boolean;
}

interface InlineVideoPreviewProps {
    src: string;
    poster: string;
    title: string;
}

function resolveProjectImages(project: Project, fallbackUrl: string) {
    if (project.imageUrls && project.imageUrls.length > 0) return project.imageUrls;

    if (project.images && project.images.length > 0 && isSanityConfigured) {
        return project.images.map((image) =>
            urlFor(image).width(1600).height(900).fit("crop").url(),
        );
    }

    return [fallbackUrl];
}

function VisualProjectCarousel({
    project,
    fallbackUrl,
    priority = false,
}: VisualProjectCarouselProps) {
    const images = resolveProjectImages(project, fallbackUrl);
    const [activeIndex, setActiveIndex] = useState(0);
    const currentUrl = images[activeIndex] ?? fallbackUrl;
    const hasMultiple = images.length > 1;

    const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="relative w-full aspect-[4/3] md:aspect-[21/9] flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                <motion.div
                    key={currentUrl}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                >
                    {/* Blurred Background Copy */}
                    <Image
                        src={currentUrl}
                        alt={`${project.title} background`}
                        fill
                        className="object-cover opacity-50 blur-sm scale-110 pointer-events-none"
                    />

                    {/* Main Image Container */}
                    <div className="absolute inset-4 md:inset-x-[10vw] lg:inset-x-[15vw] md:inset-y-8">
                        <Image
                            src={currentUrl}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            className="object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                            priority={priority}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>

            {hasMultiple && (
                <div className="absolute inset-0 z-20 flex items-center justify-between px-4 md:px-8 pointer-events-none">
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 cursor-pointer pointer-events-auto"
                        aria-label="Previous image"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/60 cursor-pointer pointer-events-auto"
                        aria-label="Next image"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}

function InlineVideoPreview({ src, poster, title }: InlineVideoPreviewProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const syncMuted = (video: HTMLVideoElement) => {
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
    };

    const attemptPlay = async () => {
        const video = videoRef.current;
        if (!video) return;

        syncMuted(video);

        try {
            await video.play();
        } catch {
            // Autoplay can be blocked by the browser; ignore silently.
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        syncMuted(video);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        void attemptPlay();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.35 },
        );

        observer.observe(video);

        return () => {
            observer.disconnect();
            video.pause();
        };
    }, [src]);

    const stopNavigation = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        stopNavigation(event);

        const video = videoRef.current;
        if (!video) return;

        syncMuted(video);

        if (video.paused) {
            video.play().catch(() => {
                // Ignore autoplay blocks; user gesture required in some browsers.
            });
        } else {
            video.pause();
        }
    };

    return (
        <div className="relative h-full w-full" onClick={stopNavigation}>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay
                loop
                muted
                preload="metadata"
                playsInline
                onLoadedMetadata={() => {
                    if (!videoRef.current) return;
                    syncMuted(videoRef.current);
                    void attemptPlay();
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={stopNavigation}
                className="h-full w-full object-cover"
                controls={false}
                aria-label={`${title} preview video`}
            />
            {!isPlaying && (
                <button
                    type="button"
                    onClick={handleToggle}
                    className="absolute inset-0 flex items-center justify-center z-10"
                    aria-label={`Play ${title} preview`}
                >
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/40 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="ml-1 opacity-90">
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    </div>
                </button>
            )}
        </div>
    );
}

export default function SelectedWorks({ projects }: SelectedWorksProps) {
    if (!projects || projects.length === 0) return null;

    // Group projects by category
    const groupedProjects = projects.reduce((acc, project) => {
        const cat = project.category || "Uncategorized";
        if (!acc[cat]) {
            acc[cat] = [];
        }
        acc[cat].push(project);
        return acc;
    }, {} as Record<string, Project[]>);

    return (
        <section id="works" className="relative py-28 md:py-36 bg-black">
            <div className="mx-auto max-w-6xl px-6 lg:px-12">
                
                {/* Section Header */}
                <ScrollReveal>
                    <div className="mb-24 md:mb-32 text-center">
                        <h1
                            className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Explore What I Do
                        </h1>
                    </div>
                </ScrollReveal>

                {/* Vertically Stacked Categories */}
                <div className="flex flex-col gap-32 md:gap-40">
                    {WORK_CATEGORIES_ORDER
                        .filter(category => groupedProjects[category] && groupedProjects[category].length > 0)
                        .map((category, catIndex) => {
                        const catProjects = groupedProjects[category];
                        const catLower = category.toLowerCase();
                        const isVisualHeavy = catLower.includes("graphic") || 
                                              catLower.includes("photography") ||
                                              catLower.includes("photo") ||
                                              catLower.includes("design");
                        const viewMoreHref =
                            category === "Video Editing"
                                ? "/projects/video-editing"
                                : "/#works";
                        const viewMoreLabel =
                            category === "Video Editing"
                                ? "View more video editing projects"
                                : `View more ${category.toLowerCase()} projects`;
                        const displayProjects =
                            category === "Video Editing"
                                ? catProjects.slice(0, 3)
                                : catProjects;

                        return (
                            <div key={category} className="w-full flex flex-col gap-12 md:gap-16">
                                {/* Category Heading */}
                                <ScrollReveal delay={0.1}>
                                    <h3
                                        className="text-center text-sm md:text-md font-bold tracking-widest text-white uppercase"
                                        style={{ fontFamily: "var(--font-montserrat)" }}
                                    >
                                        {category}
                                    </h3>
                                </ScrollReveal>

                                <div className="flex flex-col gap-20 md:gap-28">
                                    {displayProjects.map((project, index) => {
                                        const tags = project.tags ?? [];
                                        const imageUrl = project.coverImageUrl || 
                                            (project.coverImage && isSanityConfigured ? urlFor(project.coverImage).url() : 
                                            "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop");

                                        if (isVisualHeavy) {
                                            // ----------------- Graphic / Visual Layout (Full width) -----------------
                                            return (
                                                <ScrollReveal key={project._id || index} delay={0.2}>
                                                    <div className="w-[100vw] relative left-1/2 -translate-x-1/2 overflow-hidden border-y border-white/10 bg-[#111] cursor-pointer group shadow-2xl">
                                                        <VisualProjectCarousel
                                                            project={project}
                                                            fallbackUrl={imageUrl}
                                                            priority={index === 0 && catIndex === 0}
                                                        />
                                                        {/* Text overlay for visual heavy */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-500 flex flex-col items-center justify-center p-6 backdrop-blur-sm pointer-events-none">
                                                            <div className="translate-y-4 transition-transform duration-500 text-center">
                                                                <h3 className="text-2xl md:text-5xl font-extrabold text-white tracking-widest uppercase mb-4 drop-shadow-lg">
                                                                    {project.title}
                                                                </h3>
                                                                {project.description && (
                                                                    <p className="text-sm md:text-lg text-gray-300 max-w-3xl mx-auto font-medium tracking-wide">
                                                                        {project.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </ScrollReveal>
                                            );
                                        }

                                        // ----------------- Standard / Video Layout (Text Left / Visual Right) -----------------
                                        return (
                                            <ScrollReveal key={project._id || index} delay={0.2}>
                                                <Link
                                                    href={`/projects/${project.slug.current}`}
                                                    className="flex flex-col md:flex-row gap-12 md:gap-16 items-center md:items-stretch group h-full"
                                                    aria-label={`View project ${project.title}`}
                                                >
                                                    
                                                    {/* Text Column */}
                                                    <div className="flex flex-col justify-center w-full md:w-5/12 py-4">
                                                        {tags.length > 0 && (
                                                            <div className="mb-6 flex flex-wrap gap-2">
                                                                {tags.map((tag) => (
                                                                    <span
                                                                        key={`${project._id}-${tag}`}
                                                                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wide text-white/70"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                        
                                                        <h3 
                                                            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-6 uppercase leading-none"
                                                            style={{ fontFamily: "var(--font-montserrat)" }}
                                                        >
                                                            {project.title}
                                                        </h3>

                                                        <p className="text-[11px] md:text-[13px] text-gray-300 leading-loose text-justify font-medium mb-8">
                                                            {project.description}
                                                        </p>
                                                        
                                                        <div className="w-full h-[1px] bg-white/20 mt-auto" />
                                                    </div>

                                                    {/* Visual Column */}
                                                    <div className="w-full md:w-7/12 flex md:justify-end items-center">
                                                        <div className="relative bg-[#1a1a1a] rounded-[24px] p-1 md:p-2 w-full max-w-[550px] aspect-[16/10] flex items-center justify-center border-[0.5px] border-white/5 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-[#222]">
                                                            
                                                            {/* Media Container */}
                                                            <div className="relative w-full h-full rounded-md md:rounded-[12px] overflow-hidden bg-black flex items-center justify-center shadow-inner cursor-pointer">
                                                                    {project.videoUrl ? (
                                                                        <InlineVideoPreview
                                                                            src={project.videoUrl}
                                                                            poster={imageUrl}
                                                                            title={project.title}
                                                                        />
                                                                    ) : (
                                                                        <Image
                                                                            src={imageUrl}
                                                                            alt={project.title}
                                                                            fill
                                                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                                                            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                                                        />
                                                                    )}
                                                            </div>

                                                        </div>
                                                    </div>

                                                </Link>
                                            </ScrollReveal>
                                        );
                                    })}
                                </div>
                                
                                {/* View More Button */}
                                {!isVisualHeavy && (
                                    <ScrollReveal delay={0.3}>
                                        <div className="mt-8 flex justify-start">
                                            <Link
                                                href={viewMoreHref}
                                                className="group inline-flex items-center gap-2 md:gap-3 rounded-full border border-white/15 bg-gradient-to-b from-[#242424] to-[#111111] px-4 py-2.5 md:px-6 md:py-3 text-[11px] sm:text-sm md:text-base font-semibold tracking-wide text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:from-[#2a2a2a] hover:to-[#151515]"
                                            >
                                                <span className="whitespace-nowrap">{viewMoreLabel}</span>
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/50 transition-all duration-300 group-hover:bg-white">
                                                    <ArrowRight
                                                        size={16}
                                                        className="text-white transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-black"
                                                        strokeWidth={2.5}
                                                    />
                                                </span>
                                            </Link>
                                        </div>
                                    </ScrollReveal>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
