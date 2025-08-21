/**
 * Server Component: injects JSON-LD for Organization, WebSite, Service, HowTo, and FAQ.
 * Place this once on the homepage.
 */
export default function SeoHomeJsonLd() {
  const siteUrl = "https://craftmyresume.in"
  const logo = `${siteUrl}/logo-header.png`

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CraftMyResume",
    url: siteUrl,
    logo,
    sameAs: [
      // Add your real profiles when available
      "https://www.instagram.com/",
      "https://www.linkedin.com/",
    ],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CraftMyResume",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "ATS-Optimized Resume Writing, LinkedIn Optimization, and SOP Writing",
    provider: {
      "@type": "Organization",
      name: "CraftMyResume",
      url: siteUrl,
      logo,
    },
    areaServed: {
      "@type": "Country",
      name: "India",
    },
    offers: [
      {
        "@type": "Offer",
        name: "Resume Package",
        price: "499",
        priceCurrency: "INR",
        url: siteUrl,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "LinkedIn Optimization",
        price: "299",
        priceCurrency: "INR",
        url: siteUrl,
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        name: "SOP Writing Services",
        price: "499",
        priceCurrency: "INR",
        url: siteUrl,
        availability: "https://schema.org/InStock",
      },
    ],
  }

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How our resume writing service works",
    description: "Share details, quick alignment call, draft & review, and final delivery.",
    step: [
      {
        "@type": "HowToStep",
        name: "Share Details",
        text: "Upload your current resume and target roles.",
      },
      {
        "@type": "HowToStep",
        name: "Strategy Call",
        text: "20-min alignment on goals, layout, and turnaround.",
      },
      {
        "@type": "HowToStep",
        name: "Draft & Review",
        text: "We write quantified, keyword-aligned bullets and iterate fast.",
      },
      {
        "@type": "HowToStep",
        name: "Final Delivery",
        text: "Receive polished PDF, DOCX, and a tailoring checklist.",
      },
    ],
  }

  // Pull a representative subset of your FAQs for FAQPage rich results
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Will you build a resume from scratch or provide a template?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We write every resume from scratch based on your goals and target roles. We use proven, ATS-safe layouts—never generic templates.",
        },
      },
      {
        "@type": "Question",
        name: "What is the turnaround time?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "First draft typically ships in 48–72 hours after your intake. A 24-hour rush add-on is available.",
        },
      },
      {
        "@type": "Question",
        name: "How much ATS score do you guarantee?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We guarantee a minimum 75%+ ATS score on common scanners for your target role’s keywords, and we manually validate recruiter readability.",
        },
      },
      {
        "@type": "Question",
        name: "What does LinkedIn optimization include?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We rewrite Headline, About, and Experience; refine Skills; advise on banner/photo; optimize settings; and provide recruiter outreach templates.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  )
}
