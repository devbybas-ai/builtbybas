import { services } from "@/data/services";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BuiltByBas",
    url: SITE_URL,
    description:
      "Full-stack development and marketing company that builds custom software, websites, and growth strategies for businesses ready to grow.",
    founder: {
      "@type": "Person",
      name: "Bas Rosario",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      url: `${SITE_URL}/intake`,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    knowsAbout: [
      "Web Development",
      "Custom Software Development",
      "Digital Marketing",
      "AI-Powered Tools",
      "E-Commerce",
      "CRM Systems",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BuiltByBas",
    url: SITE_URL,
    description:
      "Custom software and web development — precision-engineered, no templates, no shortcuts.",
  };
}

export function getServiceSchemas() {
  return services.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: "BuiltByBas",
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    serviceType: service.title,
  }));
}

export function getBreadcrumbSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function getFAQSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
