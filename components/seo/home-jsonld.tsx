export default function SeoHomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://craftmyresume.com/#organization",
        name: "CraftMyResume",
        url: "https://craftmyresume.com",
        logo: {
          "@type": "ImageObject",
          url: "https://craftmyresume.com/logo-header.png",
          width: 200,
          height: 60,
        },
        description:
          "Professional ATS-optimized resume writing services with 75%+ ATS score guarantee. Expert writers, 48-hour delivery, cover letter included.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+91-7039409085",
          contactType: "Customer Service",
          availableLanguage: ["English", "Hindi"],
        },
        sameAs: ["https://www.linkedin.com/company/craftmyresume", "https://www.instagram.com/craftmyresume"],
      },
      {
        "@type": "WebSite",
        "@id": "https://craftmyresume.com/#website",
        url: "https://craftmyresume.com",
        name: "CraftMyResume",
        description: "Professional ATS-optimized resume writing services",
        publisher: {
          "@id": "https://craftmyresume.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://craftmyresume.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Service",
        "@id": "https://craftmyresume.com/#service",
        name: "Professional Resume Writing Service",
        description: "ATS-optimized resume writing with 75%+ score guarantee, expert writers, and 48-hour delivery",
        provider: {
          "@id": "https://craftmyresume.com/#organization",
        },
        serviceType: "Resume Writing",
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Resume Writing Packages",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Resume Package",
                description: "ATS-Friendly Resume with 75% ATS Score Guarantee, Cover Letter, 1:1 Consultation",
              },
              price: "499",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "LinkedIn Optimization",
                description:
                  "Complete LinkedIn profile optimization with keyword-rich content and recruiter outreach templates",
              },
              price: "599",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "SOP Writing Services",
                description: "Tailored Statement of Purpose for your target program with 1:1 consultation",
              },
              price: "499",
              priceCurrency: "INR",
              availability: "https://schema.org/InStock",
            },
          ],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "1200",
          bestRating: "5",
          worstRating: "1",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://craftmyresume.com/#webpage",
        url: "https://craftmyresume.com",
        name: "CraftMyResume - Professional ATS-Optimized Resume Writing Services",
        isPartOf: {
          "@id": "https://craftmyresume.com/#website",
        },
        about: {
          "@id": "https://craftmyresume.com/#organization",
        },
        description:
          "Get a professional, ATS-optimized resume that lands interviews. 75%+ ATS score guaranteed. Expert writers, 48-hour delivery, cover letter included. Starting at ₹499.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://craftmyresume.com",
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the turnaround time for resume writing?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "First draft typically ships in 48–72 hours after your intake call and document handover. We also offer a 24‑hour rush option for urgent needs.",
            },
          },
          {
            "@type": "Question",
            name: "Do you guarantee ATS compatibility?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, we guarantee a minimum 75%+ ATS score on common scanners for your target role's keywords. We test your resume on multiple ATS systems before delivery.",
            },
          },
          {
            "@type": "Question",
            name: "What file formats do I receive?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You'll receive a polished PDF (for applications) and an editable DOCX (for tailoring). We also provide a plain-text version if needed by certain ATS portals.",
            },
          },
          {
            "@type": "Question",
            name: "Is there revision support included?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, within 20 days of delivery, you get unlimited minor edits (typos, phrasing, ordering) and up to two rounds of structural changes.",
            },
          },
        ],
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
