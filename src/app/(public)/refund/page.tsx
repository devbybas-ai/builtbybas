import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/shared/JsonLd";
import { getBreadcrumbSchema } from "@/lib/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://builtbybas.com";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "BuiltByBas Refund and Cancellation Policy. Our fair and transparent approach to refunds, deposits, and project cancellations.",
  alternates: { canonical: `${SITE_URL}/refund` },
};

export default function RefundPolicyPage() {
  return (
    <>
      <JsonLd
        data={getBreadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Refund Policy", path: "/refund" },
        ])}
      />
      <main id="main-content" className="relative pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 1, 2025 &middot; Last Updated: January 1,
            2025
          </p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
            {/* 1 */}
            <section>
              <h2>1. Our Commitment</h2>
              <p className="mt-3">
                BuiltByBas (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;) is committed to delivering exceptional work
                and maintaining fair, transparent business practices. This
                Refund &amp; Cancellation Policy outlines how we handle
                deposits, refunds, and cancellations for all project
                engagements.
              </p>
              <p className="mt-2">
                We believe in earning your trust through quality work. Every
                project includes a comprehensive breakdown of deliverables, a
                documented state of the product at delivery, and a granular
                report reviewed and accepted before final payment. We stand
                behind our work.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2>2. Deposits</h2>
              <ul className="mt-3">
                <li>
                  A deposit (typically 50% of the total project fee) is required
                  before work begins on any project
                </li>
                <li>
                  The deposit secures your place in our project schedule and
                  covers the initial discovery, planning, and design phases
                </li>
                <li>
                  <strong>Deposits are non-refundable</strong> once work has
                  commenced, as they compensate for time, resources, and
                  opportunity cost committed to your project
                </li>
                <li>
                  If you cancel before any work has begun (within 48 hours of
                  deposit payment and before kickoff), a full refund of the
                  deposit will be issued
                </li>
              </ul>
            </section>

            {/* 3 */}
            <section>
              <h2>3. Cancellation by Client</h2>
              <p className="mt-3">
                You may cancel a project at any time by providing written
                notice. The refund amount depends on the stage of the project:
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th scope="col" className="pb-2 pr-4 font-medium text-foreground">
                        Stage
                      </th>
                      <th scope="col" className="pb-2 pr-4 font-medium text-foreground">
                        Refund
                      </th>
                      <th scope="col" className="pb-2 font-medium text-foreground">
                        What You Receive
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 pr-4">
                        Before work begins (within 48 hours of deposit)
                      </td>
                      <td className="py-2 pr-4">Full deposit refund</td>
                      <td className="py-2">N/A</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        Discovery &amp; planning phase
                      </td>
                      <td className="py-2 pr-4">No refund on deposit</td>
                      <td className="py-2">
                        All discovery documents, research, and planning
                        deliverables completed to date
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Design phase</td>
                      <td className="py-2 pr-4">
                        No refund on deposit; pro-rated refund of milestone
                        payments for unstarted milestones
                      </td>
                      <td className="py-2">
                        All completed designs, wireframes, and prototypes
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">Development phase</td>
                      <td className="py-2 pr-4">
                        No refund on deposit; pro-rated refund of milestone
                        payments for unstarted milestones
                      </td>
                      <td className="py-2">
                        All completed code, designs, and documentation in
                        current state
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        After final delivery
                      </td>
                      <td className="py-2 pr-4">No refund</td>
                      <td className="py-2">
                        All deliverables as specified in the SOW
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                <strong>Pro-rated refunds</strong> are calculated based on the
                percentage of the current milestone completed at the time of
                cancellation, as documented in project tracking.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2>4. Cancellation by BuiltByBas</h2>
              <p className="mt-3">
                We reserve the right to terminate a project under the following
                circumstances:
              </p>
              <ul className="mt-2">
                <li>
                  Non-payment: outstanding invoices remain unpaid for more than
                  thirty (30) days past due after written notice
                </li>
                <li>
                  Non-responsiveness: the Client is unresponsive for more than
                  thirty (30) consecutive days despite reasonable attempts to
                  communicate
                </li>
                <li>
                  Material breach: the Client materially breaches the project
                  agreement or{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
              <p className="mt-2">
                If we terminate a project, the Client will receive all completed
                work product and a pro-rated refund of any prepaid fees for
                undelivered milestones.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2>5. Satisfaction Guarantee</h2>
              <p className="mt-3">
                We are committed to delivering work that meets the agreed-upon
                specifications:
              </p>
              <ul className="mt-2">
                <li>
                  Every project includes a defined number of revision rounds
                  (specified in the proposal/SOW)
                </li>
                <li>
                  If a deliverable does not materially conform to the agreed
                  specifications, we will correct it at no additional cost
                  within the warranty period (30 days from final delivery)
                </li>
                <li>
                  We provide a comprehensive, granular report of every
                  deliverable for your review and acceptance before final
                  payment is due
                </li>
                <li>
                  Payment is not considered final until you have reviewed and
                  accepted the deliverables as documented in the project
                  completion report
                </li>
              </ul>
            </section>

            {/* 6 */}
            <section>
              <h2>6. Scope Changes</h2>
              <p className="mt-3">
                Changes to the project scope after work has begun are handled
                through our change order process:
              </p>
              <ol className="mt-2">
                <li>You submit the change request in writing</li>
                <li>
                  We provide a written assessment of the impact on timeline,
                  scope, and cost
                </li>
                <li>
                  You approve the change order before any additional work begins
                </li>
              </ol>
              <p className="mt-2">
                Scope changes are not grounds for a refund of previously
                approved and completed work. Additional fees for approved change
                orders are subject to the same payment terms as the original
                agreement.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2>7. Refund Process</h2>
              <p className="mt-3">When a refund is applicable:</p>
              <ol className="mt-2">
                <li>
                  Submit a written cancellation/refund request to
                  bas@builtbybas.com
                </li>
                <li>
                  We will acknowledge receipt within two (2) business days
                </li>
                <li>
                  We will provide a written breakdown of work completed,
                  applicable refund amount, and deliverables to be transferred
                  within five (5) business days
                </li>
                <li>
                  Approved refunds will be processed within ten (10) business
                  days of final confirmation
                </li>
                <li>
                  Refunds are issued via the original payment method unless
                  otherwise agreed
                </li>
              </ol>
            </section>

            {/* 8 */}
            <section>
              <h2>8. Hosting and Ongoing Services</h2>
              <p className="mt-3">
                For clients on hosting, maintenance, or retainer agreements:
              </p>
              <ul className="mt-2">
                <li>
                  Monthly services may be cancelled with thirty (30) days
                  written notice
                </li>
                <li>
                  Prepaid periods are non-refundable but will be honored through
                  the end of the paid period
                </li>
                <li>
                  Upon cancellation of hosting, we will assist with migration of
                  your site/application to your chosen provider at no additional
                  cost (up to two hours of migration support)
                </li>
              </ul>
            </section>

            {/* 9 */}
            <section>
              <h2>9. Disputes</h2>
              <p className="mt-3">
                If you believe a refund determination is unfair, we encourage
                you to reach out to us directly so we can resolve the matter. We
                are committed to fair outcomes and will work with you in good
                faith. If we cannot reach an agreement, disputes are subject to
                the resolution procedures outlined in our{" "}
                <Link
                  href="/terms"
                  className="text-primary hover:underline"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2>10. Contact</h2>
              <p className="mt-3">
                For refund requests, cancellations, or questions about this
                policy:
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
    </>
  );
}
