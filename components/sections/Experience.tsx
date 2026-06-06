"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import type { JobExperience } from "@/types";
import { Building2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceSectionProps {
    jobs: JobExperience[];
}

export default function ExperienceSection({ jobs }: ExperienceSectionProps) {
    if (!jobs || jobs.length === 0) return null;

    return (
        <section id="experience" className="relative py-28 md:py-36 bg-black">
            <div className="section-divider mx-auto mb-28 max-w-7xl md:mb-36" />

            <div className="mx-auto max-w-5xl px-6 lg:px-12">
                <ScrollReveal>
                    <div className="text-center mb-16 md:mb-24">
                        <h2
                            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                            Professional Experience
                        </h2>
                        <p className="mt-4 text-sm font-light tracking-wide text-muted">
                            A timeline of my professional growth across digital media and design.
                        </p>
                    </div>
                </ScrollReveal>

                {/* Timeline Container */}
                <div className="relative">
                    {/* Central Vertical Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 bg-border/50 hidden md:block" />

                    <div className="flex flex-col gap-12 md:gap-0">
                        {jobs.map((job, index) => {
                            const isLeftCard = index % 2 === 0;

                            return (
                                <div key={job._key || index} className="relative flex flex-col md:flex-row items-center justify-center md:h-auto md:min-h-[280px]">
                                    
                                    {/* Mobile Date (shows only on mobile) */}
                                    <div className="md:hidden flex items-center self-start mb-4 gap-2 text-xs font-semibold text-muted bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-white/5">
                                        <Calendar size={12} />
                                        <span>{job.startDate} - {job.endDate}</span>
                                    </div>

                                    {/* Left Column */}
                                    <div className={cn("w-full md:w-1/2 flex", isLeftCard ? "md:pr-12 lg:pr-16 md:justify-end" : "md:pl-12 lg:pl-16 md:justify-end order-last md:order-first")}>
                                        {isLeftCard ? (
                                            /* Card on Left */
                                            <ScrollReveal variant="fade-up" className="w-full sm:w-[90%] md:w-full max-w-lg">
                                                <div className="flex flex-col gap-4 rounded-2xl bg-[#111111] p-6 sm:p-8 border border-white/5 relative group transition-all duration-300 hover:border-white/10 hover:bg-[#151515]">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-foreground">{job.role}</h3>
                                                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-foreground/70">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 size={14} />
                                                                <span className="font-medium">{job.company}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-muted">
                                                        {job.description}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {job.skills.map((skill, skillIndex) => (
                                                            <span key={`${job._key || index}-skill-${skillIndex}-${skill}`} className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted border border-white/5">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </ScrollReveal>
                                        ) : (
                                            /* Date Pill on Left (Extending from Center) */
                                            <div className="hidden md:flex w-full justify-end relative h-full">
                                                <div className="absolute top-1/2 -translate-y-1/2 right-0 flex items-center pr-6 xl:pr-10">
                                                    {/* Connecting Line */}
                                                    <div className="absolute right-0 h-[1px] w-6 xl:w-10 bg-border/50" />
                                                    <ScrollReveal variant="fade-left" delay={0.2}>
                                                        <div className="flex items-center gap-2 rounded-full bg-[#111111] border border-white/10 px-4 py-2 text-xs font-semibold text-muted shadow-sm z-10 relative">
                                                            <Calendar size={12} className="text-accent" />
                                                            <span>{job.startDate} - {job.endDate}</span>
                                                        </div>
                                                    </ScrollReveal>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Central Dot */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-[3px] border-background bg-accent z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

                                    {/* Right Column */}
                                    <div className={cn("w-full md:w-1/2 flex", isLeftCard ? "md:pl-12 lg:pl-16" : "md:pr-12 lg:pr-16 md:justify-start")}>
                                        {!isLeftCard ? (
                                            /* Card on Right */
                                            <ScrollReveal variant="fade-up" className="w-full sm:w-[90%] md:w-full max-w-lg">
                                                <div className="flex flex-col gap-4 rounded-2xl bg-[#111111] p-6 sm:p-8 border border-white/5 relative group transition-all duration-300 hover:border-white/10 hover:bg-[#151515]">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-foreground">{job.role}</h3>
                                                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-foreground/70">
                                                            <div className="flex items-center gap-2">
                                                                <Building2 size={14} />
                                                                <span className="font-medium">{job.company}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-muted">
                                                        {job.description}
                                                    </p>
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {job.skills.map((skill, skillIndex) => (
                                                            <span key={`${job._key || index}-skill-${skillIndex}-${skill}`} className="rounded-full bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted border border-white/5">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </ScrollReveal>
                                        ) : (
                                            /* Date Pill on Right (Extending from Center) */
                                            <div className="hidden md:flex w-full justify-start relative h-full">
                                                <div className="absolute top-1/2 -translate-y-1/2 left-0 flex items-center pl-6 xl:pl-10">
                                                    {/* Connecting Line */}
                                                    <div className="absolute left-0 h-[1px] w-6 xl:w-10 bg-border/50" />
                                                    <ScrollReveal variant="fade-right" delay={0.2}>
                                                        <div className="flex items-center gap-2 rounded-full bg-[#111111] border border-white/10 px-4 py-2 text-xs font-semibold text-muted shadow-sm z-10 relative">
                                                            <Calendar size={12} className="text-accent" />
                                                            <span>{job.startDate} - {job.endDate}</span>
                                                        </div>
                                                    </ScrollReveal>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
