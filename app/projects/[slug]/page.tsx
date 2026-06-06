import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { safeFetch, isSanityConfigured, urlFor } from "@/lib/sanity";
import { projectBySlugQuery, projectsQuery } from "@/lib/queries";
import type { Project } from "@/types";
import Footer from "@/components/sections/Footer";



interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getProject(slug: string): Promise<Project | null> {
    const project = await safeFetch<Project>(projectBySlugQuery, { slug });
    if (project) return project;

    return null;
}

export async function generateStaticParams() {
    if (isSanityConfigured) {
        const projects = await safeFetch<Project[]>(projectsQuery);
        if (projects && projects.length > 0) {
            return projects.map((project) => ({
                slug: project.slug.current,
            }));
        }
    }

    return [];
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) notFound();

    const coverUrl = project.coverImage
        ? urlFor(project.coverImage).width(1600).height(900).fit("crop").url()
        : "";
    const galleryUrls = project.images
        ? project.images.map((image) =>
            urlFor(image).width(1600).height(900).fit("crop").url(),
        )
        : [];

    return (
        <>
            <main className="min-h-screen">
                <div className="fixed top-0 left-0 z-50 w-full glass py-4">
                    <div className="mx-auto flex max-w-7xl items-center px-6 lg:px-12">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted transition-colors hover:text-foreground"
                        >
                            <ArrowLeft
                                size={14}
                                className="transition-transform group-hover:-translate-x-1"
                            />
                            Back to Portfolio
                        </Link>
                    </div>
                </div>

                <section className="relative h-[60vh] w-full overflow-hidden sm:h-[70vh]">
                    {coverUrl ? (
                        <Image
                            src={coverUrl}
                            alt={project.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[#0b0b0b]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 z-10 p-6 lg:p-12">
                        <div className="mx-auto max-w-7xl">
                            <span className="mb-3 inline-block rounded-full bg-accent/20 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                                {project.category}
                            </span>
                            {project.tags && project.tags.length > 0 && (
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={`${project._id}-${tag}`}
                                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold tracking-wide text-white/70"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <h1
                                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
                                style={{ fontFamily: "var(--font-montserrat)" }}
                            >
                                {project.title}
                            </h1>
                            <div className="mt-4 flex items-center gap-6 text-sm text-muted">
                                {project.client && <span>Client: {project.client}</span>}
                                {project.year && <span>{project.year}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12">
                        {project.description && (
                            <div className="mx-auto mb-16 max-w-2xl md:mb-24">
                                <p className="text-lg leading-8 text-muted">
                                    {project.description}
                                </p>
                            </div>
                        )}

                        {galleryUrls.length > 0 && (
                            <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
                                {galleryUrls.map((url, i) => (
                                    <div
                                        key={i}
                                        className={`relative overflow-hidden rounded-sm ${i === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                                            }`}
                                    >
                                        <Image
                                            src={url}
                                            alt={`${project.title} — Image ${i + 1}`}
                                            fill
                                            sizes={
                                                i === 0
                                                    ? "100vw"
                                                    : "(max-width: 640px) 100vw, 50vw"
                                            }
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {project.videoUrl && (
                            <div className="mt-8 aspect-video w-full overflow-hidden rounded-sm">
                                <video
                                    src={project.videoUrl}
                                    controls
                                    controlsList="nodownload"
                                    playsInline
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
