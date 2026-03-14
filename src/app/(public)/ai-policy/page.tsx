import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
export const metadata: Metadata = {
  title: "Responsible AI Policy",
  description:
    "BuiltByBas Responsible AI Policy. How we use artificial intelligence ethically, transparently, and with human oversight.",
};

export default function AIPolicyPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="relative pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Responsible AI Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 1, 2025 &middot; Last Updated: January 1,
            2025
          </p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {/* 1 */}
            <section>
              <h2>1. Our Commitment</h2>
              <p className="mt-3">
                BuiltByBas uses artificial intelligence as a tool to enhance our
                services, never as a replacement for human judgment, creativity,
                or accountability. We believe AI should be transparent, fair,
                and always under human control.
              </p>
              <p className="mt-2">
                <strong>Our core principle:</strong> AI assists. It does not
                decide. Every AI-generated output is reviewed and approved by a
                human before it reaches any client.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2>2. How We Use AI</h2>
              <p className="mt-3">
                We use AI (specifically, Anthropic&apos;s Claude) to assist with
                the following:
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-2 pr-4 font-medium text-foreground">
                        Use Case
                      </th>
                      <th className="pb-2 pr-4 font-medium text-foreground">
                        What AI Does
                      </th>
                      <th className="pb-2 font-medium text-foreground">
                        Human Oversight
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">
                        Proposal drafting
                      </td>
                      <td className="py-2 pr-4">
                        Generates initial scope, timeline, and cost estimates
                        from your intake form
                      </td>
                      <td className="py-2">
                        Bas reviews and edits every proposal before delivery
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">
                        Project estimates
                      </td>
                      <td className="py-2 pr-4">
                        Suggests timeline and budget ranges based on project
                        complexity
                      </td>
                      <td className="py-2">
                        All estimates reviewed and adjusted before presenting
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">
                        Content generation
                      </td>
                      <td className="py-2 pr-4">
                        Creates marketing copy and content drafts for client
                        projects
                      </td>
                      <td className="py-2">
                        All content reviewed and edited before client delivery
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-medium text-foreground">
                        Intake scoring
                      </td>
                      <td className="py-2 pr-4">
                        Evaluates project readiness and scope clarity using
                        objective criteria
                      </td>
                      <td className="py-2">
                        Rule-based algorithm (no external AI); all scores
                        reviewed
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3 */}
            <section>
              <h2>3. Human Review Gates</h2>
              <p className="mt-3">
                No AI-generated content reaches a client without human review.
                This is a non-negotiable standard:
              </p>
              <ul className="mt-2">
                <li>
                  Every proposal is read, edited, and approved by the
                  BuiltByBas team before delivery
                </li>
                <li>
                  Every estimate is validated against real-world project
                  experience
                </li>
                <li>
                  Every piece of generated content is reviewed for accuracy,
                  tone, and fairness
                </li>
                <li>
                  The human reviewer has full authority to modify, reject, or
                  override any AI output
                </li>
                <li>
                  The human reviewer, not the AI, is accountable for the final
                  product
                </li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2>4. Your Data and AI</h2>

              <h3 className="mt-4">What we send to AI</h3>
              <ul className="mt-2">
                <li>
                  Your intake form responses (business info, project
                  requirements, goals)
                </li>
                <li>Project type, scope, and service category</li>
                <li>Non-sensitive business context needed for generation</li>
              </ul>

              <h3 className="mt-4">What we NEVER send to AI</h3>
              <ul className="mt-2">
                <li>Passwords or authentication credentials</li>
                <li>Payment information (credit cards, bank details)</li>
                <li>Social Security numbers or government-issued IDs</li>
                <li>Personal health information</li>
                <li>
                  Any data you have explicitly marked as confidential
                </li>
              </ul>

              <h3 className="mt-4">AI provider data handling</h3>
              <p className="mt-2">
                Our AI provider (Anthropic) operates under a zero-retention API
                policy. Your data is not stored by Anthropic and is not used to
                train their models. Data is processed in real-time and discarded
                after the response is generated.
              </p>
              <p className="mt-2">
                For full details on data collection and handling, see our{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2>5. Fairness and Bias Prevention</h2>
              <p className="mt-3">
                We design our systems to be fair and unbiased:
              </p>
              <ul className="mt-2">
                <li>
                  Project scoring and prioritization are based on objective
                  criteria: readiness, scope clarity, engagement level, and
                  feasibility
                </li>
                <li>
                  <strong>Explicitly excluded from scoring:</strong> client
                  name, email, industry, company size, budget amount, location,
                  gender, age, race, ethnicity, or any protected characteristic
                </li>
                <li>
                  All AI-generated proposals are reviewed for neutral,
                  professional language before delivery
                </li>
                <li>
                  We screen all project requests against ethical criteria and
                  decline projects involving surveillance without consent,
                  deceptive practices, discrimination, dark patterns, or
                  exploitation
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2>6. Transparency</h2>
              <p className="mt-3">We believe in honesty about AI usage:</p>
              <ul className="mt-2">
                <li>
                  If you ask whether AI was involved in any part of your
                  project, we will always give you an honest answer
                </li>
                <li>
                  Every proposal includes a line confirming it was reviewed and
                  approved by the BuiltByBas team
                </li>
                <li>
                  Our scoring criteria are documented and explainable. You can
                  request a breakdown of how your submission was assessed
                </li>
                <li>
                  This policy is publicly available and referenced in our
                  proposals and communications
                </li>
              </ul>
            </section>

            {/* 7 */}
            <section>
              <h2>7. Your Rights</h2>
              <p className="mt-3">
                As a client or prospective client, you have the right to:
              </p>
              <ul className="mt-2">
                <li>
                  Request that AI not be used in any part of your specific
                  project (we will accommodate this wherever feasible)
                </li>
                <li>
                  Request a human-only review of any AI-generated content
                  related to your project
                </li>
                <li>
                  Request an explanation of any AI-assisted assessment or
                  scoring of your submission
                </li>
                <li>
                  Request deletion of any data sent to AI providers on your
                  behalf (per Anthropic&apos;s zero-retention policy, this data
                  is not stored, but we will confirm)
                </li>
              </ul>
            </section>

            {/* 8 */}
            <section>
              <h2>8. Incident Response</h2>
              <p className="mt-3">
                If AI produces harmful, incorrect, or biased output:
              </p>
              <ul className="mt-2">
                <li>
                  Our human review gates exist to catch problems before they
                  reach clients
                </li>
                <li>
                  If problematic content is caught in review, it is corrected or
                  regenerated, never sent
                </li>
                <li>
                  If an issue reaches a client, we will contact you directly
                  within 72 hours, correct the record, and take steps to prevent
                  recurrence
                </li>
                <li>
                  All incidents are logged and reviewed to improve our processes
                </li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2>9. Compliance</h2>
              <p className="mt-3">
                This policy is designed to comply with:
              </p>
              <ul className="mt-2">
                <li>
                  California Consumer Privacy Act (CCPA) and California Privacy
                  Rights Act (CPRA)
                </li>
                <li>
                  EU General Data Protection Regulation (GDPR)
                </li>
                <li>EU AI Act (2024)</li>
                <li>
                  OECD AI Principles and UNESCO Recommendation on AI Ethics
                </li>
              </ul>
              <p className="mt-2">
                All current BuiltByBas AI use cases fall within the
                &ldquo;limited risk&rdquo; category under the EU AI Act. No
                high-risk AI systems are deployed.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2>10. Policy Review</h2>
              <p className="mt-3">This policy is reviewed:</p>
              <ul className="mt-2">
                <li>Quarterly as part of standard governance</li>
                <li>
                  Immediately when a new AI feature is added or an existing
                  feature changes
                </li>
                <li>Upon request from any client or regulatory authority</li>
                <li>After any incident involving AI-generated output</li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2>11. Contact</h2>
              <p className="mt-3">
                For questions about our AI practices or to exercise your rights
                under this policy:
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
          </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
