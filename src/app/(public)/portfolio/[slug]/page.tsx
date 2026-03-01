import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { CaseStudyLayout } from "@/components/public-site/CaseStudyLayout";
import { CTASection } from "@/components/public-site/CTASection";
import { projects, getProjectBySlug } from "@/data/portfolio";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject =
    currentIndex > 0
      ? { slug: projects[currentIndex - 1].slug, title: projects[currentIndex - 1].title }
      : undefined;
  const nextProject =
    currentIndex < projects.length - 1
      ? { slug: projects[currentIndex + 1].slug, title: projects[currentIndex + 1].title }
      : undefined;

  return (
    <>
      <PublicHeader />
      <main id="main-content">
        <CaseStudyLayout
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
        />
        <CTASection
          heading="Ready to Get Results Like These?"
          description="Every project starts with a conversation. Tell us about your business and we'll craft a solution that delivers."
        />
      </main>
      <PublicFooter />
    </>
  );
}
