import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBreadcrumbSchema } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "BuiltByBas Privacy Policy. How we collect, use, and protect your personal information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy" },
        ])}
      />
      <main id="main-content" className="relative pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 1, 2025 &middot; Last Updated: January 1,
            2025
          </p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {/* 1 */}
            <section>
              <h2>1. Who We Are</h2>
              <p className="mt-3">
                BuiltByBas (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a California-based
                software development and web design business. We operate the
                website{" "}
                <strong>builtbybas.com</strong> (the &ldquo;Site&rdquo;). This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you visit the Site or engage our
                services.
              </p>
              <p className="mt-2">
                By accessing or using the Site, you agree to the terms of this
                Privacy Policy. If you do not agree, please do not use the Site.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2>2. Information We Collect</h2>

              <h3 className="mt-4">2.1 Information You Provide Directly</h3>
              <p className="mt-2">
                When you submit our project intake form or otherwise communicate
                with us, we may collect:
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Contact information:</strong> name, email address,
                  phone number, preferred contact method
                </li>
                <li>
                  <strong>Business information:</strong> company name, industry,
                  business size, years in business, existing website URL
                </li>
                <li>
                  <strong>Project details:</strong> selected services,
                  service-specific requirements, timeline, budget range, design
                  preferences, brand assets, competitor/inspiration references,
                  additional notes
                </li>
                <li>
                  <strong>Referral source:</strong> how you heard about us
                </li>
              </ul>

              <h3 className="mt-4">
                2.2 Information Collected Automatically
              </h3>
              <p className="mt-2">
                We use <strong>Umami Analytics</strong>, a privacy-focused,
                cookieless analytics platform self-hosted on our infrastructure.
                Umami does not use cookies, does not track users across
                websites, and does not collect personally identifiable
                information. The aggregated, anonymous data collected includes:
              </p>
              <ul className="mt-2">
                <li>Page views and referral sources</li>
                <li>Browser type and operating system</li>
                <li>Device type and screen resolution</li>
                <li>Country-level geographic location (no IP addresses stored)</li>
              </ul>

              <h3 className="mt-4">2.3 Information We Do Not Collect</h3>
              <ul className="mt-2">
                <li>
                  We do <strong>not</strong> use third-party tracking cookies,
                  advertising pixels, or cross-site trackers
                </li>
                <li>
                  We do <strong>not</strong> sell, rent, or trade your personal
                  information to any third party for advertising or marketing
                  purposes
                </li>
                <li>
                  We do <strong>not</strong> collect financial information such
                  as credit card numbers through the Site (payments are processed
                  through secure third-party processors)
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2>3. How We Use Your Information</h2>
              <p className="mt-3">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Service delivery:</strong> to evaluate your project
                  needs, generate proposals, communicate with you, and deliver
                  contracted services
                </li>
                <li>
                  <strong>Business operations:</strong> to manage our client
                  pipeline, track project status, and improve our internal
                  processes
                </li>
                <li>
                  <strong>Communication:</strong> to respond to your inquiries,
                  send project updates, proposals, and follow-up communications
                  related to your project
                </li>
                <li>
                  <strong>Site improvement:</strong> to analyze aggregated,
                  anonymous usage data to improve the Site&apos;s performance
                  and user experience
                </li>
                <li>
                  <strong>Legal compliance:</strong> to comply with applicable
                  laws, regulations, and legal processes
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2>4. AI-Assisted Processing</h2>
              <p className="mt-3">
                We use artificial intelligence tools (specifically, Anthropic&apos;s
                Claude) to assist in generating project proposals, estimates,
                and scope documents based on the information you provide through
                our intake form. Your intake data is processed through these AI
                tools solely for the purpose of generating your proposal.
              </p>
              <p className="mt-2">
                All AI-generated content is reviewed by a human team member
                before delivery. We do not use your data to train AI models. Our
                AI provider (Anthropic) processes data in accordance with their
                published privacy and data handling policies and does not retain
                input data for model training.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2>5. How We Share Your Information</h2>
              <p className="mt-3">
                We do not sell your personal information. We may share your
                information only in the following limited circumstances:
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Service providers:</strong> We use Resend for
                  transactional email delivery (proposals, follow-ups). These
                  providers process data solely on our behalf and are
                  contractually obligated to protect your information.
                </li>
                <li>
                  <strong>AI processing:</strong> As described in Section 4,
                  intake data is processed through Anthropic&apos;s API for
                  proposal generation.
                </li>
                <li>
                  <strong>Legal requirements:</strong> We may disclose
                  information if required by law, subpoena, court order, or
                  other governmental request, or when we believe disclosure is
                  necessary to protect our rights, your safety, or the safety of
                  others.
                </li>
                <li>
                  <strong>Business transfers:</strong> In the event of a merger,
                  acquisition, reorganization, or sale of assets, your
                  information may be transferred as part of that transaction. We
                  will provide notice before your information becomes subject to
                  a different privacy policy.
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2>6. Data Retention</h2>
              <p className="mt-3">
                We retain your information for as long as necessary to fulfill
                the purposes described in this policy:
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Active client data:</strong> Retained for the duration
                  of our business relationship and for a period of three (3)
                  years following project completion for warranty, support, and
                  reference purposes
                </li>
                <li>
                  <strong>Intake submissions (non-clients):</strong> Retained
                  for up to one (1) year following submission to allow for
                  follow-up, then permanently deleted unless you engage our
                  services
                </li>
                <li>
                  <strong>Proposals:</strong> Retained for two (2) years from
                  the date of generation
                </li>
                <li>
                  <strong>Analytics data:</strong> Umami retains aggregated,
                  anonymous analytics data indefinitely. No personally
                  identifiable information is stored in analytics.
                </li>
                <li>
                  <strong>Session data:</strong> Authentication sessions expire
                  automatically and are purged from our database upon expiration
                </li>
              </ul>
              <p className="mt-2">
                You may request earlier deletion of your data at any time by
                contacting us (see Section 10).
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2>7. Data Security</h2>
              <p className="mt-3">
                We implement commercially reasonable technical and
                organizational measures to protect your personal information,
                including:
              </p>
              <ul className="mt-2">
                <li>
                  SSL/TLS encryption for all data transmitted between your
                  browser and our servers
                </li>
                <li>
                  Passwords hashed using bcrypt with industry-standard salt
                  rounds
                </li>
                <li>
                  HTTP-only, secure cookies for authentication sessions
                </li>
                <li>
                  Role-based access controls limiting data access to authorized
                  personnel
                </li>
                <li>
                  Database hosted on secured infrastructure with restricted
                  network access
                </li>
                <li>
                  Rate limiting on authentication endpoints to prevent brute
                  force attacks
                </li>
              </ul>
              <p className="mt-2">
                While we strive to protect your information, no method of
                electronic transmission or storage is 100% secure. We cannot
                guarantee absolute security but will notify affected users
                promptly in the event of a data breach as required by applicable
                law.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2>8. Your Rights Under California Law (CCPA/CPRA)</h2>
              <p className="mt-3">
                If you are a California resident, you have the following rights
                under the California Consumer Privacy Act (CCPA) as amended by
                the California Privacy Rights Act (CPRA):
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Right to Know:</strong> You may request that we
                  disclose the categories and specific pieces of personal
                  information we have collected about you, the categories of
                  sources, the business purpose for collection, and the
                  categories of third parties with whom we share it.
                </li>
                <li>
                  <strong>Right to Delete:</strong> You may request that we
                  delete the personal information we have collected from you,
                  subject to certain legal exceptions.
                </li>
                <li>
                  <strong>Right to Correct:</strong> You may request that we
                  correct inaccurate personal information we maintain about you.
                </li>
                <li>
                  <strong>Right to Opt-Out of Sale/Sharing:</strong> We do{" "}
                  <strong>not</strong> sell or share your personal information
                  for cross-context behavioral advertising. There is nothing to
                  opt out of.
                </li>
                <li>
                  <strong>Right to Non-Discrimination:</strong> We will not
                  discriminate against you for exercising any of your privacy
                  rights.
                </li>
                <li>
                  <strong>Right to Limit Use of Sensitive Personal Information:</strong>{" "}
                  We do not collect sensitive personal information as defined
                  under the CPRA (e.g., Social Security numbers, financial
                  account details, precise geolocation, biometric data).
                </li>
              </ul>
              <p className="mt-2">
                To exercise any of these rights, contact us using the
                information in Section 10. We will verify your identity before
                processing your request and respond within forty-five (45) days
                as required by law.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2>9. Children&apos;s Privacy</h2>
              <p className="mt-3">
                The Site is not directed to individuals under the age of 16. We
                do not knowingly collect personal information from children
                under 16. If we learn that we have inadvertently collected such
                information, we will delete it promptly. If you believe a child
                under 16 has provided us with personal information, please
                contact us immediately.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2>10. Contact Us</h2>
              <p className="mt-3">
                If you have questions about this Privacy Policy, wish to
                exercise your privacy rights, or need to report a concern,
                contact us at:
              </p>
              <div className="mt-3 rounded-lg border border-white/10 bg-white/5 p-4">
                <p>
                  <strong>BuiltByBas</strong>
                </p>
                <p>Email: bas@builtbybas.com</p>
                <p>Website: builtbybas.com</p>
                <p>Location: California, United States</p>
              </div>
            </section>

            {/* 11 */}
            <section>
              <h2>11. Changes to This Policy</h2>
              <p className="mt-3">
                We may update this Privacy Policy from time to time. When we
                make material changes, we will update the &ldquo;Last
                Updated&rdquo; date at the top of this page and, where
                appropriate, provide additional notice (such as a banner on the
                Site or direct communication). Your continued use of the Site
                after any changes constitutes your acceptance of the updated
                policy.
              </p>
              <p className="mt-2">
                We encourage you to review this policy periodically.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
