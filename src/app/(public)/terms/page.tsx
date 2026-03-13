import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "BuiltByBas Terms of Service. The agreement governing your use of our website and services.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="relative pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 1, 2025 &middot; Last Updated: January 1,
            2025
          </p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1">
            {/* 1 */}
            <section>
              <h2>1. Agreement to Terms</h2>
              <p className="mt-3">
                These Terms of Service (&ldquo;Terms&rdquo;) constitute a
                legally binding agreement between you (&ldquo;Client,&rdquo;
                &ldquo;you,&rdquo; or &ldquo;your&rdquo;) and BuiltByBas
                (&ldquo;Company,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                &ldquo;our&rdquo;), a California-based software development and
                web design business operating at builtbybas.com (the
                &ldquo;Site&rdquo;).
              </p>
              <p className="mt-2">
                By accessing or using the Site, submitting a project intake
                form, or engaging our services, you agree to be bound by these
                Terms. If you do not agree, do not use the Site or our services.
              </p>
              <p className="mt-2">
                These Terms apply to all visitors, users, and clients. Separate
                project agreements or statements of work (&ldquo;SOW&rdquo;)
                executed for specific engagements shall supplement, and in the
                event of conflict shall take precedence over, these Terms.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2>2. Services</h2>
              <p className="mt-3">
                BuiltByBas provides custom software development, web design,
                dashboard development, client portals, CRM systems, e-commerce
                solutions, AI-augmented tools, and related digital services.
                Specific deliverables, timelines, milestones, and pricing for
                each engagement are defined in a separate proposal or SOW
                provided to the Client.
              </p>
              <p className="mt-2">
                All proposals and SOWs are generated with AI assistance and
                reviewed by a human team member before delivery. Proposals are
                not binding contracts until accepted by the Client and confirmed
                by BuiltByBas. See our{" "}
                <Link href="/ai-policy" className="text-primary hover:underline">
                  Responsible AI Policy
                </Link>{" "}
                for details on how AI is used in our workflow.
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2>3. Client Responsibilities</h2>
              <p className="mt-3">By engaging our services, you agree to:</p>
              <ol className="mt-2">
                <li>
                  Provide accurate, complete, and timely information as
                  requested through the intake form and throughout the project
                </li>
                <li>
                  Designate a single point of contact authorized to make
                  decisions and provide approvals on behalf of your organization
                </li>
                <li>
                  Respond to requests for feedback, approvals, and content
                  within the timeframes specified in the project SOW (default:
                  five (5) business days)
                </li>
                <li>
                  Provide all necessary assets (logos, brand guidelines, copy,
                  images, credentials) in a timely manner
                </li>
                <li>
                  Ensure that all content, materials, and assets you provide are
                  owned by you or that you have the legal right to use them
                </li>
              </ol>
              <p className="mt-2">
                Delays caused by the Client&apos;s failure to meet these
                responsibilities may result in extended timelines and, in some
                cases, additional charges as outlined in the SOW.
              </p>
            </section>

            {/* 4 */}
            <section>
              <h2>4. Intellectual Property</h2>

              <h3 className="mt-4">4.1 Work Product</h3>
              <p className="mt-2">
                Upon full payment of all invoiced amounts, the Client receives
                full ownership of all custom-built deliverables created
                specifically for the Client&apos;s project, including but not
                limited to: custom code, designs, layouts, copy, and
                configurations (&ldquo;Work Product&rdquo;).
              </p>

              <h3 className="mt-4">4.2 Pre-Existing Materials</h3>
              <p className="mt-2">
                BuiltByBas retains ownership of all pre-existing tools,
                libraries, frameworks, templates, processes, and methodologies
                used in the creation of the Work Product (&ldquo;Pre-Existing
                Materials&rdquo;). The Client receives a non-exclusive,
                perpetual, royalty-free license to use any Pre-Existing
                Materials incorporated into the delivered Work Product.
              </p>

              <h3 className="mt-4">4.3 Third-Party Components</h3>
              <p className="mt-2">
                Deliverables may include open-source software components
                governed by their respective licenses (e.g., MIT, Apache 2.0).
                BuiltByBas will disclose all material third-party dependencies
                upon request. The Client is responsible for complying with
                applicable open-source license terms.
              </p>

              <h3 className="mt-4">4.4 Portfolio Rights</h3>
              <p className="mt-2">
                Unless otherwise agreed in writing, BuiltByBas retains the right
                to display the completed project in its portfolio, case studies,
                and marketing materials. The Client may opt out of portfolio
                inclusion by providing written notice at any time.
              </p>
            </section>

            {/* 5 */}
            <section>
              <h2>5. Payment Terms</h2>
              <ul className="mt-3">
                <li>
                  <strong>Deposit:</strong> A non-refundable deposit (typically
                  50% of the total project fee) is required before work begins,
                  unless otherwise specified in the SOW
                </li>
                <li>
                  <strong>Milestone payments:</strong> For larger projects,
                  payments may be structured around milestone completions as
                  defined in the SOW
                </li>
                <li>
                  <strong>Final payment:</strong> The remaining balance is due
                  upon project completion and before final deliverables are
                  transferred
                </li>
                <li>
                  <strong>Late payments:</strong> Invoices not paid within
                  fifteen (15) days of the due date may incur a late fee of 1.5%
                  per month (or the maximum rate permitted by California law,
                  whichever is lower) on the outstanding balance
                </li>
                <li>
                  <strong>Work suspension:</strong> BuiltByBas reserves the
                  right to suspend work on any project with an outstanding
                  balance more than thirty (30) days past due
                </li>
              </ul>
              <p className="mt-2">
                All prices are in United States Dollars (USD) unless otherwise
                specified. The Client is responsible for all applicable taxes.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2>6. Project Timeline and Delivery</h2>
              <p className="mt-3">
                Estimated timelines are provided in good faith based on the
                information available at the time of the proposal. Timelines may
                be adjusted due to:
              </p>
              <ul className="mt-2">
                <li>
                  Scope changes requested by the Client (subject to a change
                  order process)
                </li>
                <li>
                  Delays in Client responses, approvals, or asset delivery
                </li>
                <li>
                  Discovery of technical complexities not apparent at the
                  proposal stage
                </li>
                <li>Force majeure events (see Section 12)</li>
              </ul>
              <p className="mt-2">
                BuiltByBas will communicate any anticipated timeline changes
                promptly and in writing.
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2>7. Revisions and Change Orders</h2>
              <p className="mt-3">
                Each proposal includes a specified number of revision rounds.
                Revisions within scope are included at no additional cost.
                Requests that materially change the project scope, add new
                features, or require significant rework beyond the original
                agreement will be handled through a formal change order process:
              </p>
              <ol className="mt-2">
                <li>Client submits the change request in writing</li>
                <li>
                  BuiltByBas provides a written assessment of impact on
                  timeline, scope, and cost
                </li>
                <li>
                  Client approves the change order before additional work begins
                </li>
              </ol>
              <p className="mt-2">
                No additional charges will be incurred without the Client&apos;s
                prior written approval.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2>8. Warranties and Disclaimers</h2>

              <h3 className="mt-4">8.1 Service Warranty</h3>
              <p className="mt-2">
                BuiltByBas warrants that all services will be performed in a
                professional and workmanlike manner consistent with industry
                standards. Deliverables will materially conform to the
                specifications agreed upon in the SOW.
              </p>

              <h3 className="mt-4">8.2 Bug Fix Period</h3>
              <p className="mt-2">
                For a period of thirty (30) days following final delivery (the
                &ldquo;Warranty Period&rdquo;), BuiltByBas will correct, at no
                additional cost, any bugs, defects, or errors in the delivered
                Work Product that prevent it from functioning as specified in the
                SOW. This warranty does not cover issues arising from:
              </p>
              <ul className="mt-2">
                <li>
                  Modifications made by the Client or third parties after
                  delivery
                </li>
                <li>
                  Changes to third-party services, APIs, or platforms outside
                  our control
                </li>
                <li>Client-provided content, assets, or data</li>
                <li>Use of the deliverables outside their intended purpose</li>
              </ul>

              <h3 className="mt-4">8.3 Disclaimer</h3>
              <p className="mt-2">
                EXCEPT AS EXPRESSLY PROVIDED IN THIS SECTION, ALL SERVICES AND
                DELIVERABLES ARE PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY
                OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                NON-INFRINGEMENT, OR RESULTS. BUILTBYBAS DOES NOT WARRANT THAT
                THE SITE OR DELIVERABLES WILL BE UNINTERRUPTED, ERROR-FREE, OR
                COMPLETELY SECURE.
              </p>
            </section>

            {/* 9 */}
            <section>
              <h2>9. Limitation of Liability</h2>
              <p className="mt-3">
                TO THE MAXIMUM EXTENT PERMITTED BY CALIFORNIA LAW:
              </p>
              <ul className="mt-2">
                <li>
                  BUILTBYBAS&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS
                  ARISING OUT OF OR RELATED TO THESE TERMS OR ANY PROJECT SHALL
                  NOT EXCEED THE TOTAL FEES PAID BY THE CLIENT TO BUILTBYBAS FOR
                  THE SPECIFIC PROJECT GIVING RISE TO THE CLAIM
                </li>
                <li>
                  IN NO EVENT SHALL BUILTBYBAS BE LIABLE FOR ANY INDIRECT,
                  INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                  INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, BUSINESS
                  OPPORTUNITIES, OR GOODWILL, REGARDLESS OF WHETHER SUCH DAMAGES
                  WERE FORESEEABLE OR WHETHER BUILTBYBAS WAS ADVISED OF THE
                  POSSIBILITY OF SUCH DAMAGES
                </li>
              </ul>
              <p className="mt-2">
                This limitation of liability does not apply to damages resulting
                from gross negligence, willful misconduct, or fraud by
                BuiltByBas, or to any liability that cannot be excluded or
                limited under applicable law.
              </p>
            </section>

            {/* 10 */}
            <section>
              <h2>10. Indemnification</h2>
              <p className="mt-3">
                The Client agrees to indemnify, defend, and hold harmless
                BuiltByBas and its officers, employees, and agents from and
                against any claims, damages, losses, liabilities, costs, and
                expenses (including reasonable attorneys&apos; fees) arising out
                of or related to:
              </p>
              <ul className="mt-2">
                <li>
                  The Client&apos;s breach of these Terms or any project
                  agreement
                </li>
                <li>
                  Content, materials, or data provided by the Client that
                  infringe upon the intellectual property rights or other rights
                  of any third party
                </li>
                <li>
                  The Client&apos;s use of the deliverables in violation of
                  applicable law
                </li>
              </ul>
            </section>

            {/* 11 */}
            <section>
              <h2>11. Confidentiality</h2>
              <p className="mt-3">
                Both parties agree to maintain the confidentiality of any
                proprietary or confidential information disclosed during the
                course of the engagement (&ldquo;Confidential
                Information&rdquo;). Confidential Information does not include
                information that:
              </p>
              <ul className="mt-2">
                <li>Is or becomes publicly available through no fault of the receiving party</li>
                <li>Was known to the receiving party prior to disclosure</li>
                <li>Is independently developed by the receiving party without reference to the disclosing party&apos;s Confidential Information</li>
                <li>Is rightfully received from a third party without restriction</li>
              </ul>
              <p className="mt-2">
                This confidentiality obligation survives the termination of any
                engagement for a period of two (2) years.
              </p>
            </section>

            {/* 12 */}
            <section>
              <h2>12. Termination and Cancellation</h2>

              <h3 className="mt-4">12.1 Termination by Client</h3>
              <p className="mt-2">
                The Client may terminate a project at any time by providing
                written notice. Upon termination:
              </p>
              <ul className="mt-2">
                <li>
                  The Client is responsible for payment for all work completed
                  up to the date of termination
                </li>
                <li>
                  Deposits are non-refundable (see our{" "}
                  <Link
                    href="/refund"
                    className="text-primary hover:underline"
                  >
                    Refund Policy
                  </Link>{" "}
                  for details)
                </li>
                <li>
                  All completed deliverables up to the termination date will be
                  provided to the Client upon payment of outstanding balances
                </li>
              </ul>

              <h3 className="mt-4">12.2 Termination by BuiltByBas</h3>
              <p className="mt-2">
                BuiltByBas may terminate a project upon thirty (30) days written
                notice if:
              </p>
              <ul className="mt-2">
                <li>
                  The Client fails to make payments when due after written
                  notice and a reasonable cure period
                </li>
                <li>
                  The Client materially breaches these Terms or the project
                  agreement
                </li>
                <li>
                  The Client is unresponsive for more than thirty (30)
                  consecutive days despite reasonable attempts to communicate
                </li>
              </ul>
              <p className="mt-2">
                In the event of termination by BuiltByBas, the Client will
                receive all completed work product and a pro-rated refund of any
                prepaid fees for undelivered work.
              </p>

              <h3 className="mt-4">12.3 Effect of Termination</h3>
              <p className="mt-2">
                Sections 4 (Intellectual Property), 5 (Payment Terms), 8.3
                (Disclaimer), 9 (Limitation of Liability), 10
                (Indemnification), 11 (Confidentiality), and 14 (Governing Law)
                shall survive termination.
              </p>
            </section>

            {/* 13 */}
            <section>
              <h2>13. Force Majeure</h2>
              <p className="mt-3">
                Neither party shall be liable for failure or delay in
                performance caused by circumstances beyond its reasonable
                control, including but not limited to: natural disasters,
                pandemics, government actions, war, terrorism, labor disputes,
                internet outages, power failures, or cyberattacks. The affected
                party shall provide prompt notice and use reasonable efforts to
                mitigate the impact.
              </p>
            </section>

            {/* 14 */}
            <section>
              <h2>14. Governing Law and Dispute Resolution</h2>
              <p className="mt-3">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of California, without regard to its
                conflict of laws provisions.
              </p>
              <p className="mt-2">
                Any dispute arising out of or relating to these Terms or any
                project engagement shall first be submitted to good-faith
                mediation administered in the State of California. If mediation
                fails to resolve the dispute within sixty (60) days, either
                party may pursue binding arbitration in accordance with the
                rules of the American Arbitration Association, with proceedings
                conducted in California. The prevailing party shall be entitled
                to recover reasonable attorneys&apos; fees and costs.
              </p>
              <p className="mt-2">
                Nothing in this section prevents either party from seeking
                injunctive or equitable relief in a court of competent
                jurisdiction to protect its intellectual property rights or
                Confidential Information.
              </p>
            </section>

            {/* 15 */}
            <section>
              <h2>15. Miscellaneous</h2>
              <ul className="mt-3">
                <li>
                  <strong>Entire Agreement:</strong> These Terms, together with
                  any executed SOW or project agreement, constitute the entire
                  agreement between the parties and supersede all prior or
                  contemporaneous agreements, representations, or
                  understandings.
                </li>
                <li>
                  <strong>Severability:</strong> If any provision of these Terms
                  is found to be invalid or unenforceable, the remaining
                  provisions shall remain in full force and effect.
                </li>
                <li>
                  <strong>Waiver:</strong> The failure of either party to
                  enforce any provision of these Terms shall not constitute a
                  waiver of that provision or the right to enforce it at a later
                  time.
                </li>
                <li>
                  <strong>Assignment:</strong> The Client may not assign or
                  transfer these Terms or any rights hereunder without the prior
                  written consent of BuiltByBas. BuiltByBas may assign these
                  Terms in connection with a merger, acquisition, or sale of
                  assets.
                </li>
                <li>
                  <strong>Notices:</strong> All formal notices under these Terms
                  shall be in writing and delivered by email to the addresses on
                  file.
                </li>
              </ul>
            </section>

            {/* 16 */}
            <section>
              <h2>16. Changes to These Terms</h2>
              <p className="mt-3">
                We may update these Terms from time to time. When we make
                material changes, we will update the &ldquo;Last Updated&rdquo;
                date at the top of this page. For active clients, material
                changes will be communicated directly. Continued use of the Site
                after changes constitutes acceptance of the updated Terms.
              </p>
            </section>

            {/* 17 */}
            <section>
              <h2>17. Contact</h2>
              <p className="mt-3">
                For questions about these Terms of Service, contact us at:
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
