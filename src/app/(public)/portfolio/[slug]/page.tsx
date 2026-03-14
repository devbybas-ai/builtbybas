import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/public-site/CTASection";
import { ProjectDetail } from "@/components/portfolio/ProjectDetail";
import { DemoDetail } from "@/components/portfolio/DemoDetail";
import { DemoRenderer } from "@/components/portfolio/DemoRenderer";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBreadcrumbSchema, getCreativeWorkSchema } from "@/lib/json-ld";
import { projects, getProjectBySlug } from "@/data/portfolio";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

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
    description: project.subtitle,
    alternates: { canonical: `${SITE_URL}/portfolio/${slug}` },
  };
}

export default async function ProjectPage({ params }: PageProps) {
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

  const breadcrumbData = getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Portfolio", path: "/portfolio" },
    { name: project.title, path: `/portfolio/${slug}` },
  ]);
  const creativeWorkData = getCreativeWorkSchema({
    name: project.title,
    description: project.subtitle,
    url: project.url,
    image: project.image,
    slug,
  });

  if (project.isDemo) {
    return (
      <>
        <JsonLd data={breadcrumbData} />
        <JsonLd data={creativeWorkData} />
        <main id="main-content">
          <DemoDetail
            project={project}
            prevProject={prevProject}
            nextProject={nextProject}
          >
            <DemoRenderer slug={project.slug} />
          </DemoDetail>
          <CTASection
            heading="Want This Level of Quality?"
            description="Every project gets the same attention to detail. Tell us about yours."
          />
        </main>
      </>
    );
  }

  return (
    <>
      <JsonLd data={breadcrumbData} />
      <JsonLd data={creativeWorkData} />
      <main id="main-content">
        <ProjectDetail
          project={project}
          prevProject={prevProject}
          nextProject={nextProject}
        />
        <CTASection
          heading="Ready to Get Results Like These?"
          description="Every project starts with a conversation. Tell us about your business and we'll craft a solution that delivers."
        />
      </main>
    </>
  );
}
