import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/sections/Footer";
import ProjectCard from "@/components/ui/ProjectCard";

import { safeFetch, isSanityConfigured, urlFor } from "@/lib/sanity";
import {
  aboutQuery,
  videoEditingProjectsCountQuery,
  videoEditingProjectsQuery,
} from "@/lib/queries";
import type { About, Project } from "@/types";

const CATEGORY = "Video Editing";
const PAGE_SIZE = 6;

interface PageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

function parsePage(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw ?? 1);
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function resolveCoverImage(project: Project) {
  if (project.coverImageUrl) return project;
  if (!isSanityConfigured || !project.coverImage) return project;

  return {
    ...project,
    coverImageUrl: urlFor(project.coverImage).width(1200).height(900).fit("crop").url(),
  };
}

async function getVideoEditingData(page: number) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const [projects, totalCount, about] = await Promise.all([
    safeFetch<Project[]>(videoEditingProjectsQuery, {
      category: CATEGORY,
      start,
      end,
    }),
    safeFetch<number>(videoEditingProjectsCountQuery, {
      category: CATEGORY,
    }),
    safeFetch<About>(aboutQuery),
  ]);

  const items = (projects ?? []).map(resolveCoverImage);
  const totalItems = totalCount ?? items.length;

  return {
    projects: items,
    totalItems,
    about,
  };
}

export default async function VideoEditingProjectsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parsePage(resolvedSearchParams?.page);
  const { projects, totalItems, about } = await getVideoEditingData(page);
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const pageHref = (value: number) =>
    value <= 1 ? "/projects/video-editing" : `/projects/video-editing?page=${value}`;

  return (
    <main className="min-h-screen bg-black">
      <Navbar photographerName={about?.name?.toUpperCase()} />

      <section className="pt-24 md:pt-32 pb-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Overview
            </p>
            <h1
              className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Video Editing Projects
            </h1>
            <p className="mt-4 text-sm text-white/60 sm:text-base">
              Showing {totalItems} project{totalItems === 1 ? "" : "s"} in this
              category.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f0f] p-10 text-center text-white/60">
              No video editing projects yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  index={index}
                  size="medium"
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4 text-sm">
              {hasPrev ? (
                <Link
                  href={pageHref(page - 1)}
                  className="rounded-full border border-white/20 px-4 py-2 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-full border border-white/10 px-4 py-2 text-white/30">
                  Previous
                </span>
              )}
              <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                Page {page} of {totalPages}
              </span>
              {hasNext ? (
                <Link
                  href={pageHref(page + 1)}
                  className="rounded-full border border-white/20 px-4 py-2 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-full border border-white/10 px-4 py-2 text-white/30">
                  Next
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer photographerName={about?.name} />
    </main>
  );
}
