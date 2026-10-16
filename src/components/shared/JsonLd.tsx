import React from "react";

export function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.gannahaat.online";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "GannaHaat",
    alternateName: ["गन्ना हाट", "Ganna Haat", "gannahaat", "GannaHaat Sugarcane Platform"],
    description: "ग्रामीण भारत के गन्ना किसानों और चीनी मिल/कोल्हू व्यापारियों के लिए डिजिटल नीलामी मंच",
    inLanguage: ["hi", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/buyer/marketplace?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "GannaHaat",
    alternateName: "गन्ना हाट",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description:
      "गन्ना किसानों और चीनी मिलों के बीच पारदर्शी डिजिटल नीलामी और व्यापार की सुविधा।",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      availableLanguage: ["Hindi", "English"],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
    </>
  );
}
