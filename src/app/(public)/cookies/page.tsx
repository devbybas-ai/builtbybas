import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "BuiltByBas Cookie Policy. How we use cookies and tracking technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" className="relative pt-24 pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Cookie Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 1, 2025 &middot; Last Updated: January 1,
            2025
          </p>

          <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:text-base [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
            {/* 1 */}
            <section>
              <h2>1. Overview</h2>
              <p className="mt-3">
                This Cookie Policy explains how BuiltByBas (&ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;) uses cookies and
                similar technologies on builtbybas.com (the &ldquo;Site&rdquo;).
                We are committed to transparency about the technologies we use
                and the data we collect.
              </p>
              <p className="mt-2">
                <strong>The short version:</strong> We use minimal cookies, only
                what is strictly necessary for the Site to function. We do not
                use advertising cookies, tracking pixels, or cross-site
                trackers.
              </p>
            </section>

            {/* 2 */}
            <section>
              <h2>2. What Are Cookies?</h2>
              <p className="mt-3">
                Cookies are small text files placed on your device by websites
                you visit. They are widely used to make websites work
                efficiently, provide information to site owners, and enable
                certain features. Cookies may be &ldquo;session&rdquo; cookies
                (deleted when you close your browser) or &ldquo;persistent&rdquo;
                cookies (remaining on your device for a set period or until you
                delete them).
              </p>
            </section>

            {/* 3 */}
            <section>
              <h2>3. Cookies We Use</h2>

              <h3 className="mt-4">
                3.1 Strictly Necessary Cookies (Essential)
              </h3>
              <p className="mt-2">
                These cookies are required for the Site to function and cannot
                be disabled. They do not store any personally identifiable
                information beyond what is necessary for your session.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-2 pr-4 font-medium text-foreground">
                        Cookie
                      </th>
                      <th className="pb-2 pr-4 font-medium text-foreground">
                        Purpose
                      </th>
                      <th className="pb-2 pr-4 font-medium text-foreground">
                        Duration
                      </th>
                      <th className="pb-2 font-medium text-foreground">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="py-2 pr-4 font-mono text-xs">
                        session_token
                      </td>
                      <td className="py-2 pr-4">
                        Authentication for admin dashboard and client portal
                        (logged-in users only)
                      </td>
                      <td className="py-2 pr-4">Session-based</td>
                      <td className="py-2">
                        httpOnly, Secure, SameSite=Lax
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3">
                The session cookie is only set when you log into the admin
                dashboard or client portal. If you are a visitor browsing the
                public site,{" "}
                <strong>no cookies are set on your device at all.</strong>
              </p>

              <h3 className="mt-6">3.2 Analytics</h3>
              <p className="mt-2">
                We use <strong>Umami Analytics</strong>, a privacy-focused,
                open-source analytics platform that we self-host on our own
                infrastructure.
              </p>
              <ul className="mt-2">
                <li>
                  <strong>Umami does not use cookies.</strong> It is a fully
                  cookieless analytics solution
                </li>
                <li>
                  Umami does not track individual users across sessions or
                  websites
                </li>
                <li>
                  No personally identifiable information is collected or stored
                </li>
                <li>IP addresses are not logged or stored</li>
                <li>
                  All data is aggregated and anonymous. We see page view counts,
                  referral sources, device types, and country-level location
                  only
                </li>
                <li>
                  Data is stored on our own servers and is never shared with
                  third parties
                </li>
              </ul>
              <p className="mt-2">
                Because Umami is cookieless and collects no personal data, it
                does not require cookie consent under GDPR, CCPA/CPRA, or
                ePrivacy regulations.
              </p>

              <h3 className="mt-6">3.3 Cookies We Do NOT Use</h3>
              <ul className="mt-2">
                <li>No advertising or marketing cookies</li>
                <li>No third-party tracking cookies</li>
                <li>No social media tracking pixels</li>
                <li>
                  No Google Analytics, Facebook Pixel, or similar third-party
                  trackers
                </li>
                <li>No cross-site behavioral profiling</li>
                <li>No fingerprinting technologies</li>
              </ul>
            </section>

            {/* 4 */}
            <section>
              <h2>4. Managing Cookies</h2>
              <p className="mt-3">
                Since we only use a single strictly necessary cookie (and only
                for authenticated users), there is nothing to opt out of for
                general visitors. However, you can manage cookies through your
                browser settings:
              </p>
              <ul className="mt-2">
                <li>
                  Most browsers allow you to view, manage, and delete cookies
                  through their settings or preferences menu
                </li>
                <li>
                  Blocking the session cookie will prevent you from logging into
                  the admin dashboard or client portal
                </li>
                <li>
                  Browsing the public site does not require any cookies to be
                  enabled
                </li>
              </ul>
            </section>

            {/* 5 */}
            <section>
              <h2>5. Do Not Track</h2>
              <p className="mt-3">
                Some browsers send a &ldquo;Do Not Track&rdquo; (DNT) signal.
                Because we do not track visitors across websites and do not use
                advertising cookies, our practices already align with the intent
                of DNT signals regardless of whether your browser sends one.
              </p>
            </section>

            {/* 6 */}
            <section>
              <h2>6. California Residents</h2>
              <p className="mt-3">
                Under the CCPA/CPRA, we do not sell personal information and do
                not share personal information for cross-context behavioral
                advertising. We do not use cookies or similar technologies for
                such purposes. For full details on your California privacy
                rights, see our{" "}
                <Link
                  href="/privacy"
                  className="text-primary hover:underline"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </section>

            {/* 7 */}
            <section>
              <h2>7. Changes to This Policy</h2>
              <p className="mt-3">
                If we introduce new cookie types or change our analytics
                approach, we will update this policy and the &ldquo;Last
                Updated&rdquo; date. Material changes will be communicated via a
                notice on the Site.
              </p>
            </section>

            {/* 8 */}
            <section>
              <h2>8. Contact</h2>
              <p className="mt-3">
                For questions about this Cookie Policy, contact us at:
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
