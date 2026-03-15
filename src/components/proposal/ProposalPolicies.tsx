/**
 * Compact policy content components for the proposal page overlay.
 * These render the essential legal text from each policy page
 * without the page-level layout (metadata, breadcrumbs, nav).
 */

/* ------------------------------------------------------------------ */
/*  Privacy Policy                                                     */
/* ------------------------------------------------------------------ */

export function PrivacyContent() {
  return (
    <>
      <p className="text-xs text-white/30">
        Effective Date: January 1, 2025
      </p>

      <section>
        <h2>1. Who We Are</h2>
        <p className="mt-2">
          BuiltByBas is a California-based software development and web design
          business operating at builtbybas.com. This Privacy Policy explains how
          we collect, use, disclose, and safeguard your information when you
          visit the Site or engage our services.
        </p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <h3 className="mt-3">2.1 Information You Provide Directly</h3>
        <p className="mt-2">
          When you submit our project intake form or communicate with us, we may
          collect:
        </p>
        <ul className="mt-2">
          <li>
            <strong>Contact information:</strong> name, email address, phone
            number, preferred contact method
          </li>
          <li>
            <strong>Business information:</strong> company name, industry,
            business size, years in business, existing website URL
          </li>
          <li>
            <strong>Project details:</strong> selected services, requirements,
            timeline, budget range, design preferences, brand assets
          </li>
          <li>
            <strong>Referral source:</strong> how you heard about us
          </li>
        </ul>

        <h3 className="mt-3">2.2 Information Collected Automatically</h3>
        <p className="mt-2">
          We use Umami Analytics, a privacy-focused, cookieless analytics
          platform self-hosted on our infrastructure. Umami does not use
          cookies, does not track users across websites, and does not collect
          personally identifiable information.
        </p>

        <h3 className="mt-3">2.3 Information We Do Not Collect</h3>
        <ul className="mt-2">
          <li>
            We do <strong>not</strong> use third-party tracking cookies,
            advertising pixels, or cross-site trackers
          </li>
          <li>
            We do <strong>not</strong> sell, rent, or trade your personal
            information to any third party
          </li>
          <li>
            We do <strong>not</strong> collect financial information such as
            credit card numbers through the Site
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul className="mt-2">
          <li>
            <strong>Service delivery:</strong> to evaluate your project needs,
            generate proposals, communicate with you, and deliver services
          </li>
          <li>
            <strong>Business operations:</strong> to manage our client pipeline
            and improve processes
          </li>
          <li>
            <strong>Communication:</strong> to respond to inquiries and send
            project updates
          </li>
          <li>
            <strong>Site improvement:</strong> to analyze aggregated, anonymous
            usage data
          </li>
          <li>
            <strong>Legal compliance:</strong> to comply with applicable laws
          </li>
        </ul>
      </section>

      <section>
        <h2>4. AI-Assisted Processing</h2>
        <p className="mt-2">
          We use AI tools (Anthropic&apos;s Claude) to assist in generating
          project proposals, estimates, and scope documents. All AI-generated
          content is reviewed by a human team member before delivery. We do not
          use your data to train AI models.
        </p>
      </section>

      <section>
        <h2>5. How We Share Your Information</h2>
        <p className="mt-2">
          We do not sell your personal information. We may share information
          only with service providers (Resend for email), AI processing
          (Anthropic API), as required by law, or in business transfers.
        </p>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <ul className="mt-2">
          <li>
            <strong>Active client data:</strong> Duration of relationship + 3
            years
          </li>
          <li>
            <strong>Intake submissions:</strong> Up to 1 year
          </li>
          <li>
            <strong>Proposals:</strong> 2 years from generation
          </li>
        </ul>
        <p className="mt-2">
          You may request earlier deletion at any time.
        </p>
      </section>

      <section>
        <h2>7. Data Security</h2>
        <p className="mt-2">
          We implement commercially reasonable measures including SSL/TLS
          encryption, bcrypt password hashing, httpOnly secure cookies,
          role-based access controls, and rate limiting.
        </p>
      </section>

      <section>
        <h2>8. Your Rights Under California Law (CCPA/CPRA)</h2>
        <ul className="mt-2">
          <li>
            <strong>Right to Know</strong> what personal information we collect
          </li>
          <li>
            <strong>Right to Delete</strong> your personal information
          </li>
          <li>
            <strong>Right to Correct</strong> inaccurate information
          </li>
          <li>
            <strong>Right to Non-Discrimination</strong> for exercising your
            rights
          </li>
        </ul>
        <p className="mt-2">
          Contact us to exercise these rights. We respond within 45 days.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p className="mt-2">
          <strong>BuiltByBas</strong> - Email: bas@builtbybas.com - California,
          United States
        </p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Terms of Service                                                   */
/* ------------------------------------------------------------------ */

export function TermsContent() {
  return (
    <>
      <p className="text-xs text-white/30">
        Effective Date: January 1, 2025
      </p>

      <section>
        <h2>1. Agreement to Terms</h2>
        <p className="mt-2">
          These Terms constitute a legally binding agreement between you and
          BuiltByBas, a California-based software development and web design
          business. By accessing the Site, submitting a project intake form, or
          engaging our services, you agree to be bound by these Terms.
        </p>
      </section>

      <section>
        <h2>2. Services</h2>
        <p className="mt-2">
          BuiltByBas provides custom software development, web design,
          dashboards, client portals, CRM systems, e-commerce, and AI-augmented
          tools. Deliverables, timelines, and pricing are defined in a separate
          proposal or SOW. Proposals are not binding until accepted and
          confirmed.
        </p>
      </section>

      <section>
        <h2>3. Client Responsibilities</h2>
        <ol className="mt-2">
          <li>Provide accurate, complete, and timely information</li>
          <li>Designate a single authorized point of contact</li>
          <li>
            Respond to feedback requests within 5 business days (default)
          </li>
          <li>Provide necessary assets in a timely manner</li>
          <li>Ensure all provided materials are legally yours to use</li>
        </ol>
      </section>

      <section>
        <h2>4. Intellectual Property</h2>
        <p className="mt-2">
          Upon full payment, clients receive full ownership of custom-built
          deliverables. BuiltByBas retains ownership of pre-existing tools and
          methodologies, with a perpetual license granted to the client.
          Third-party open-source components remain under their respective
          licenses. BuiltByBas retains portfolio display rights unless opted out
          in writing.
        </p>
      </section>

      <section>
        <h2>5. Payment Terms</h2>
        <ul className="mt-2">
          <li>
            <strong>Deposit:</strong> 50% non-refundable deposit before work
            begins
          </li>
          <li>
            <strong>Milestones:</strong> Payments structured around completions
          </li>
          <li>
            <strong>Final payment:</strong> Due upon completion, before final
            transfer
          </li>
          <li>
            <strong>Late fees:</strong> 1.5% per month after 15 days past due
          </li>
          <li>
            <strong>Suspension:</strong> Work may be suspended after 30 days
            past due
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Project Timeline and Delivery</h2>
        <p className="mt-2">
          Estimated timelines are provided in good faith. Adjustments may occur
          due to scope changes, client delays, or unforeseen technical
          complexity. Changes will be communicated promptly.
        </p>
      </section>

      <section>
        <h2>7. Revisions and Change Orders</h2>
        <p className="mt-2">
          Each proposal includes specified revision rounds at no extra cost.
          Scope changes require a formal change order with written approval
          before additional work begins. No charges without prior approval.
        </p>
      </section>

      <section>
        <h2>8. Warranties and Disclaimers</h2>
        <p className="mt-2">
          Services are performed in a professional and workmanlike manner. A
          30-day warranty period covers bugs and defects. EXCEPT AS EXPRESSLY
          PROVIDED, ALL SERVICES ARE PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY
          OF ANY KIND.
        </p>
      </section>

      <section>
        <h2>9. Limitation of Liability</h2>
        <p className="mt-2">
          Total liability shall not exceed fees paid for the specific project.
          BuiltByBas is not liable for indirect, incidental, special, or
          consequential damages.
        </p>
      </section>

      <section>
        <h2>10-12. Indemnification, Confidentiality, Termination</h2>
        <p className="mt-2">
          Client agrees to indemnify BuiltByBas against claims arising from
          client-provided materials. Both parties maintain confidentiality for 2
          years. Either party may terminate with written notice; completed work
          and pro-rated refunds apply.
        </p>
      </section>

      <section>
        <h2>13-15. Force Majeure, Governing Law, Miscellaneous</h2>
        <p className="mt-2">
          Neither party is liable for delays beyond reasonable control. These
          Terms are governed by California law. Disputes go through mediation,
          then binding arbitration in California.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p className="mt-2">
          <strong>BuiltByBas</strong> - Email: bas@builtbybas.com - California,
          United States
        </p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Cookie Policy                                                      */
/* ------------------------------------------------------------------ */

export function CookieContent() {
  return (
    <>
      <p className="text-xs text-white/30">
        Effective Date: January 1, 2025
      </p>

      <section>
        <h2>1. Overview</h2>
        <p className="mt-2">
          <strong>The short version:</strong> We use minimal cookies, only what
          is strictly necessary for the Site to function. We do not use
          advertising cookies, tracking pixels, or cross-site trackers.
        </p>
      </section>

      <section>
        <h2>2. What Are Cookies?</h2>
        <p className="mt-2">
          Cookies are small text files placed on your device by websites. They
          may be session cookies (deleted when you close your browser) or
          persistent cookies (remaining for a set period).
        </p>
      </section>

      <section>
        <h2>3. Cookies We Use</h2>
        <h3 className="mt-3">3.1 Strictly Necessary Cookies</h3>
        <table className="mt-2">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col">Cookie</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-mono text-xs">session_token</td>
              <td>Authentication (logged-in users only)</td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2">
          The session cookie is only set when you log in. If you are browsing
          the public site, <strong>no cookies are set on your device.</strong>
        </p>

        <h3 className="mt-3">3.2 Analytics</h3>
        <p className="mt-2">
          We use Umami Analytics, a cookieless, self-hosted analytics platform.
          No personally identifiable information is collected. No IP addresses
          are stored.
        </p>

        <h3 className="mt-3">3.3 Cookies We Do NOT Use</h3>
        <ul className="mt-2">
          <li>No advertising or marketing cookies</li>
          <li>No third-party tracking cookies</li>
          <li>No social media tracking pixels</li>
          <li>No Google Analytics, Facebook Pixel, or similar trackers</li>
          <li>No fingerprinting technologies</li>
        </ul>
      </section>

      <section>
        <h2>4. Managing Cookies</h2>
        <p className="mt-2">
          Since we only use one strictly necessary cookie (for authenticated
          users), there is nothing to opt out of for general visitors. Blocking
          the session cookie will prevent login to the admin dashboard or
          client portal.
        </p>
      </section>

      <section>
        <h2>5. Do Not Track</h2>
        <p className="mt-2">
          We do not track visitors across websites and do not use advertising
          cookies. Our practices already align with DNT signals.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p className="mt-2">
          <strong>BuiltByBas</strong> - Email: bas@builtbybas.com - California,
          United States
        </p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Refund & Cancellation Policy                                       */
/* ------------------------------------------------------------------ */

export function RefundContent() {
  return (
    <>
      <p className="text-xs text-white/30">
        Effective Date: January 1, 2025
      </p>

      <section>
        <h2>1. Our Commitment</h2>
        <p className="mt-2">
          BuiltByBas is committed to fair, transparent business practices.
          Every project includes a comprehensive breakdown of deliverables and
          a granular report reviewed and accepted before final payment.
        </p>
      </section>

      <section>
        <h2>2. Deposits</h2>
        <ul className="mt-2">
          <li>
            A deposit (typically 50%) is required before work begins
          </li>
          <li>
            <strong>Deposits are non-refundable</strong> once work has
            commenced
          </li>
          <li>
            Full refund if cancelled within 48 hours of payment and before
            kickoff
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Cancellation by Client</h2>
        <p className="mt-2">
          You may cancel at any time with written notice. Refund depends on
          project stage:
        </p>
        <table className="mt-2">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col">Stage</th>
              <th scope="col">Refund</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td>Before work begins (within 48 hours)</td>
              <td>Full deposit refund</td>
            </tr>
            <tr>
              <td>Discovery and planning</td>
              <td>No refund on deposit</td>
            </tr>
            <tr>
              <td>Design or development</td>
              <td>Pro-rated refund for unstarted milestones</td>
            </tr>
            <tr>
              <td>After final delivery</td>
              <td>No refund</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>4. Cancellation by BuiltByBas</h2>
        <p className="mt-2">
          We may terminate for non-payment (30+ days past due),
          non-responsiveness (30+ consecutive days), or material breach. The
          client receives all completed work and a pro-rated refund for
          undelivered milestones.
        </p>
      </section>

      <section>
        <h2>5. Satisfaction Guarantee</h2>
        <ul className="mt-2">
          <li>Defined revision rounds included in every project</li>
          <li>30-day warranty period for defects</li>
          <li>
            Granular report reviewed and accepted before final payment
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Refund Process</h2>
        <ol className="mt-2">
          <li>Submit written request to bas@builtbybas.com</li>
          <li>Acknowledged within 2 business days</li>
          <li>Breakdown provided within 5 business days</li>
          <li>Refund processed within 10 business days</li>
        </ol>
      </section>

      <section>
        <h2>Contact</h2>
        <p className="mt-2">
          <strong>BuiltByBas</strong> - Email: bas@builtbybas.com - California,
          United States
        </p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Responsible AI Policy                                              */
/* ------------------------------------------------------------------ */

export function ResponsibleAIContent() {
  return (
    <>
      <p className="text-xs text-white/30">
        Effective Date: January 1, 2025
      </p>

      <section>
        <h2>1. Our Commitment</h2>
        <p className="mt-2">
          BuiltByBas uses AI as a tool to enhance our services, never as a
          replacement for human judgment. <strong>AI assists. It does not
          decide.</strong> Every AI-generated output is reviewed and approved by
          a human before it reaches any client.
        </p>
      </section>

      <section>
        <h2>2. How We Use AI</h2>
        <p className="mt-2">
          We use Anthropic&apos;s Claude to assist with:
        </p>
        <table className="mt-2">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col">Use Case</th>
              <th scope="col">Human Oversight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td>Proposal drafting</td>
              <td>Every proposal reviewed and edited before delivery</td>
            </tr>
            <tr>
              <td>Project estimates</td>
              <td>All estimates reviewed and adjusted</td>
            </tr>
            <tr>
              <td>Content generation</td>
              <td>All content reviewed before client delivery</td>
            </tr>
            <tr>
              <td>Intake scoring</td>
              <td>Rule-based algorithm, all scores reviewed</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>3. Human Review Gates</h2>
        <p className="mt-2">
          No AI-generated content reaches a client without human review. The
          human reviewer has full authority to modify, reject, or override any
          AI output. The human, not the AI, is accountable for the final
          product.
        </p>
      </section>

      <section>
        <h2>4. Your Data and AI</h2>
        <h3 className="mt-3">What we send to AI</h3>
        <ul className="mt-2">
          <li>Intake form responses (business info, project requirements)</li>
          <li>Project type, scope, and service category</li>
        </ul>
        <h3 className="mt-3">What we NEVER send to AI</h3>
        <ul className="mt-2">
          <li>Passwords or authentication credentials</li>
          <li>Payment information</li>
          <li>Social Security numbers or government IDs</li>
          <li>Personal health information</li>
        </ul>
        <p className="mt-2">
          Our AI provider (Anthropic) operates under a zero-retention API
          policy. Your data is not stored and is not used to train models.
        </p>
      </section>

      <section>
        <h2>5. Fairness and Bias Prevention</h2>
        <ul className="mt-2">
          <li>
            Scoring based on objective criteria: readiness, scope clarity,
            feasibility
          </li>
          <li>
            <strong>Excluded from scoring:</strong> name, email, industry,
            company size, budget, location, gender, age, race, or any protected
            characteristic
          </li>
          <li>
            All proposals reviewed for neutral, professional language
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Your Rights</h2>
        <ul className="mt-2">
          <li>Request that AI not be used in your project</li>
          <li>Request human-only review of any AI-generated content</li>
          <li>Request explanation of any AI-assisted assessment</li>
        </ul>
      </section>

      <section>
        <h2>7. Compliance</h2>
        <p className="mt-2">
          This policy complies with CCPA/CPRA, EU GDPR, EU AI Act (2024), and
          OECD AI Principles. All current use cases are &quot;limited
          risk&quot; under the EU AI Act.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p className="mt-2">
          <strong>BuiltByBas</strong> - Email: bas@builtbybas.com - California,
          United States
        </p>
      </section>
    </>
  );
}
