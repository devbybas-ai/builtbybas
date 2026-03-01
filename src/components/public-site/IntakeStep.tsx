"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { IntakeFormData } from "@/types/intake";

interface IntakeStepProps {
  step: number;
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: <K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K]
  ) => void;
}

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return (
    <p className="mt-1 text-sm text-red-400" role="alert">
      {error}
    </p>
  );
}

function StepHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

function CheckboxGroup({
  options,
  selected,
  onChange,
}: {
  options: string[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const isChecked = selected.includes(option);
        return (
          <label
            key={option}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
              isChecked
                ? "border-primary/30 bg-primary/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            )}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                if (isChecked) {
                  onChange(selected.filter((s) => s !== option));
                } else {
                  onChange([...selected, option]);
                }
              }}
              className="sr-only"
            />
            <div
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                isChecked
                  ? "border-primary bg-primary"
                  : "border-white/30"
              )}
            >
              {isChecked && (
                <svg
                  className="h-3 w-3 text-background"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            {option}
          </label>
        );
      })}
    </div>
  );
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors",
            value === option
              ? "border-primary/30 bg-primary/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20"
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option}
            onChange={() => onChange(option)}
            className="sr-only"
          />
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
              value === option
                ? "border-primary"
                : "border-white/30"
            )}
          >
            {value === option && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          {option}
        </label>
      ))}
    </div>
  );
}

function TextArea({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}

export function IntakeStep({ step, formData, errors, onUpdate }: IntakeStepProps) {
  switch (step) {
    case 0:
      return (
        <div>
          <StepHeader
            title="Let's Start With You"
            description="Tell us who you are and how to reach you."
          />
          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => onUpdate("name", e.target.value)}
                placeholder="Your name"
                className="mt-1.5"
              />
              <FieldError error={errors.name} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onUpdate("email", e.target.value)}
                placeholder="you@company.com"
                className="mt-1.5"
              />
              <FieldError error={errors.email} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onUpdate("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => onUpdate("company", e.target.value)}
                placeholder="Your company"
                className="mt-1.5"
              />
              <FieldError error={errors.company} />
            </div>
          </div>
        </div>
      );

    case 1:
      return (
        <div>
          <StepHeader
            title="About Your Business"
            description="Help us understand your business so we can tailor our approach."
          />
          <div className="space-y-5">
            <div>
              <Label>Industry *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="industry"
                  options={[
                    "Professional Services",
                    "Home Services",
                    "Healthcare",
                    "Retail / E-Commerce",
                    "Food & Hospitality",
                    "Fitness & Wellness",
                    "Real Estate",
                    "Other",
                  ]}
                  value={formData.industry}
                  onChange={(v) => onUpdate("industry", v)}
                />
              </div>
              <FieldError error={errors.industry} />
            </div>
            <div>
              <Label>Business Size *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="businessSize"
                  options={[
                    "Just me",
                    "2-5 people",
                    "6-20 people",
                    "21-50 people",
                    "50+ people",
                  ]}
                  value={formData.businessSize}
                  onChange={(v) => onUpdate("businessSize", v)}
                />
              </div>
              <FieldError error={errors.businessSize} />
            </div>
            <div>
              <Label htmlFor="website">Current Website (optional)</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => onUpdate("website", e.target.value)}
                placeholder="https://yoursite.com"
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      );

    case 2:
      return (
        <div>
          <StepHeader
            title="What Do You Need?"
            description="Select all the project types that apply."
          />
          <CheckboxGroup
            options={[
              "Marketing Website",
              "Website Redesign",
              "Landing Page",
              "E-Commerce Store",
              "Business Dashboard",
              "Client Portal",
              "CRM System",
              "Full Operations Platform",
              "AI-Powered Tools",
              "Marketing Strategy",
            ]}
            selected={formData.projectTypes}
            onChange={(v) => onUpdate("projectTypes", v)}
          />
          <FieldError error={errors.projectTypes} />
        </div>
      );

    case 3:
      return (
        <div>
          <StepHeader
            title="Tell Us More"
            description="Describe your project and what you're trying to achieve."
          />
          <div className="space-y-5">
            <div>
              <Label htmlFor="description">Project Description *</Label>
              <div className="mt-1.5">
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(v) => onUpdate("description", v)}
                  placeholder="What do you need built? What problem are you solving?"
                  rows={5}
                />
              </div>
              <FieldError error={errors.description} />
            </div>
            <div>
              <Label htmlFor="goals">Goals & Success Metrics *</Label>
              <div className="mt-1.5">
                <TextArea
                  id="goals"
                  value={formData.goals}
                  onChange={(v) => onUpdate("goals", v)}
                  placeholder="What does success look like? More leads? Faster operations? Better client experience?"
                  rows={4}
                />
              </div>
              <FieldError error={errors.goals} />
            </div>
          </div>
        </div>
      );

    case 4:
      return (
        <div>
          <StepHeader
            title="Timeline & Budget"
            description="Help us understand your timeline and investment range."
          />
          <div className="space-y-5">
            <div>
              <Label>Timeline *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="timeline"
                  options={[
                    "ASAP — I needed this yesterday",
                    "1-3 months",
                    "3-6 months",
                    "Flexible — quality over speed",
                  ]}
                  value={formData.timeline}
                  onChange={(v) => onUpdate("timeline", v)}
                />
              </div>
              <FieldError error={errors.timeline} />
            </div>
            <div>
              <Label>Investment Range *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="budgetRange"
                  options={[
                    "$1,000 - $5,000",
                    "$5,000 - $15,000",
                    "$15,000 - $30,000",
                    "$30,000+",
                    "Not sure yet",
                  ]}
                  value={formData.budgetRange}
                  onChange={(v) => onUpdate("budgetRange", v)}
                />
              </div>
              <FieldError error={errors.budgetRange} />
            </div>
          </div>
        </div>
      );

    case 5:
      return (
        <div>
          <StepHeader
            title="Where Are You Now?"
            description="Understanding your current state helps us plan the right approach."
          />
          <div className="space-y-5">
            <div>
              <Label>Do you have an existing website? *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="hasExistingSite"
                  options={[
                    "Yes — it needs a complete rebuild",
                    "Yes — it needs updates",
                    "No — starting from scratch",
                    "I have a basic template/builder site",
                  ]}
                  value={formData.hasExistingSite}
                  onChange={(v) => onUpdate("hasExistingSite", v)}
                />
              </div>
              <FieldError error={errors.hasExistingSite} />
            </div>
            <div>
              <Label htmlFor="painPoints">Current Pain Points (optional)</Label>
              <div className="mt-1.5">
                <TextArea
                  id="painPoints"
                  value={formData.currentPainPoints}
                  onChange={(v) => onUpdate("currentPainPoints", v)}
                  placeholder="What's not working with your current setup?"
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 6:
      return (
        <div>
          <StepHeader
            title="Features & Capabilities"
            description="Select any features you're interested in. Don't worry — we'll refine this together."
          />
          <CheckboxGroup
            options={[
              "Contact / Lead Capture Forms",
              "Online Booking / Scheduling",
              "E-Commerce / Payments",
              "Client Portal / Dashboard",
              "Content Management (CMS)",
              "Email Marketing Integration",
              "Analytics & Reporting",
              "AI-Powered Features",
              "SEO Optimization",
              "Social Media Integration",
              "Mobile App",
              "Custom Integrations / API",
            ]}
            selected={formData.desiredFeatures}
            onChange={(v) => onUpdate("desiredFeatures", v)}
          />
        </div>
      );

    case 7:
      return (
        <div>
          <StepHeader
            title="Design Direction"
            description="What look and feel resonates with your brand?"
          />
          <div className="space-y-5">
            <div>
              <Label>Design Preference *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="designPreference"
                  options={[
                    "Modern & Minimal",
                    "Bold & Energetic",
                    "Professional & Corporate",
                    "Creative & Unique",
                    "Let BuiltByBas decide",
                  ]}
                  value={formData.designPreference}
                  onChange={(v) => onUpdate("designPreference", v)}
                />
              </div>
              <FieldError error={errors.designPreference} />
            </div>
            <div>
              <Label>Do you have existing brand assets? *</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="hasBrandAssets"
                  options={[
                    "Yes — logo, colors, brand guide",
                    "Partial — logo only",
                    "No — I need branding too",
                  ]}
                  value={formData.hasBrandAssets}
                  onChange={(v) => onUpdate("hasBrandAssets", v)}
                />
              </div>
              <FieldError error={errors.hasBrandAssets} />
            </div>
          </div>
        </div>
      );

    case 8:
      return (
        <div>
          <StepHeader
            title="Inspiration & Competition"
            description="This helps us understand the landscape and your vision."
          />
          <div className="space-y-5">
            <div>
              <Label htmlFor="competitors">
                Competitors or Similar Businesses (optional)
              </Label>
              <div className="mt-1.5">
                <TextArea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(v) => onUpdate("competitors", v)}
                  placeholder="List any competitors or businesses in your space"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="inspiration">
                Websites You Love (optional)
              </Label>
              <div className="mt-1.5">
                <TextArea
                  id="inspiration"
                  value={formData.inspiration}
                  onChange={(v) => onUpdate("inspiration", v)}
                  placeholder="Share URLs of websites you admire (any industry)"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      );

    case 9:
      return (
        <div>
          <StepHeader
            title="Anything Else?"
            description="Last step — share anything else that would help us understand your project."
          />
          <div className="space-y-5">
            <div>
              <Label htmlFor="additionalNotes">
                Additional Notes (optional)
              </Label>
              <div className="mt-1.5">
                <TextArea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(v) => onUpdate("additionalNotes", v)}
                  placeholder="Anything else you'd like us to know?"
                  rows={4}
                />
              </div>
            </div>
            <div>
              <Label>How did you hear about BuiltByBas? (optional)</Label>
              <div className="mt-1.5">
                <RadioGroup
                  name="howDidYouHear"
                  options={[
                    "Google Search",
                    "Social Media",
                    "Referral",
                    "Other",
                  ]}
                  value={formData.howDidYouHear}
                  onChange={(v) => onUpdate("howDidYouHear", v)}
                />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
