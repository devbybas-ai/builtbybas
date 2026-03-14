"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { IntakeFormData, StepConfig } from "@/types/intake";
import { SERVICE_MODULES, getServiceModule } from "@/data/intake-questions";
import type { IntakeQuestion } from "@/data/intake-questions";

interface IntakeStepProps {
  stepConfig: StepConfig;
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: <K extends keyof IntakeFormData>(
    field: K,
    value: IntakeFormData[K],
  ) => void;
  onUpdateServiceAnswer: (
    serviceId: string,
    questionId: string,
    value: string | string[],
  ) => void;
}

/* ------------------------------------------------------------------ */
/*  Shared sub-components                                              */
/* ------------------------------------------------------------------ */

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
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (value: string[]) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const isChecked = selected.includes(option.value);
        return (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
              isChecked
                ? "border-primary/30 bg-primary/5"
                : "border-white/10 bg-white/[0.02] hover:border-white/20",
            )}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                if (isChecked) {
                  onChange(selected.filter((s) => s !== option.value));
                } else {
                  onChange([...selected, option.value]);
                }
              }}
              className="sr-only"
            />
            <div
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                isChecked ? "border-primary bg-primary" : "border-white/30",
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
            {option.label}
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
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
            value === option.value
              ? "border-primary/30 bg-primary/5"
              : "border-white/10 bg-white/[0.02] hover:border-white/20",
          )}
        >
          <input
            type="radio"
            name={name}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
              value === option.value ? "border-primary" : "border-white/30",
            )}
          >
            {value === option.value && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          {option.label}
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

/* ------------------------------------------------------------------ */
/*  Service question renderer                                          */
/* ------------------------------------------------------------------ */

function ServiceQuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: IntakeQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  error?: string;
}) {
  switch (question.type) {
    case "text":
    case "url":
    case "number":
      return (
        <div>
          <Label htmlFor={question.id}>
            {question.label} {question.required && "*"}
          </Label>
          <Input
            id={question.id}
            type={question.type === "url" ? "url" : question.type === "number" ? "number" : "text"}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={question.placeholder}
            className="mt-1.5"
          />
          {question.helpText && (
            <p className="mt-1 text-xs text-muted-foreground">
              {question.helpText}
            </p>
          )}
          <FieldError error={error} />
        </div>
      );

    case "textarea":
      return (
        <div>
          <Label htmlFor={question.id}>
            {question.label} {question.required && "*"}
          </Label>
          <div className="mt-1.5">
            <TextArea
              id={question.id}
              value={typeof value === "string" ? value : ""}
              onChange={(v) => onChange(v)}
              placeholder={question.placeholder}
            />
          </div>
          <FieldError error={error} />
        </div>
      );

    case "radio":
      return (
        <div>
          <Label>
            {question.label} {question.required && "*"}
          </Label>
          <div className="mt-1.5">
            <RadioGroup
              name={question.id}
              options={
                question.options?.map((o) => ({
                  value: o.value,
                  label: o.label,
                })) ?? []
              }
              value={typeof value === "string" ? value : ""}
              onChange={(v) => onChange(v)}
            />
          </div>
          <FieldError error={error} />
        </div>
      );

    case "checkbox":
      return (
        <div>
          <Label>
            {question.label} {question.required && "*"}
          </Label>
          <div className="mt-1.5">
            <CheckboxGroup
              options={
                question.options?.map((o) => ({
                  value: o.value,
                  label: o.label,
                })) ?? []
              }
              selected={Array.isArray(value) ? value : []}
              onChange={(v) => onChange(v)}
            />
          </div>
          <FieldError error={error} />
        </div>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Step renderers                                                     */
/* ------------------------------------------------------------------ */

function ServiceSelectionStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
  return (
    <div>
      <StepHeader
        title="What Do You Need?"
        description="Select all services that apply. Your form will adapt with targeted questions for each."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_MODULES.map((svc) => {
          const isSelected = formData.selectedServices.includes(svc.serviceId);
          return (
            <label
              key={svc.serviceId}
              className={cn(
                "flex cursor-pointer flex-col gap-1.5 rounded-xl border p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
                isSelected
                  ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20",
              )}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  const next = isSelected
                    ? formData.selectedServices.filter(
                        (id) => id !== svc.serviceId,
                      )
                    : [...formData.selectedServices, svc.serviceId];
                  onUpdate("selectedServices", next);
                }}
                className="sr-only"
              />
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-white/30",
                  )}
                >
                  {isSelected && (
                    <svg
                      className="h-3.5 w-3.5 text-background"
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
                <span className="font-semibold">{svc.serviceLabel}</span>
              </div>
              <p className="pl-7 text-xs text-muted-foreground">
                {svc.tagline}
              </p>
            </label>
          );
        })}
      </div>
      <FieldError error={errors.selectedServices} />
    </div>
  );
}

function ContactStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
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
}

function BusinessStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
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
                { value: "professional-services", label: "Professional Services" },
                { value: "home-services", label: "Home Services" },
                { value: "healthcare", label: "Healthcare" },
                { value: "retail-ecommerce", label: "Retail / E-Commerce" },
                { value: "food-hospitality", label: "Food & Hospitality" },
                { value: "fitness-wellness", label: "Fitness & Wellness" },
                { value: "real-estate", label: "Real Estate" },
                { value: "construction", label: "Construction" },
                { value: "education", label: "Education" },
                { value: "nonprofit", label: "Nonprofit" },
                { value: "technology", label: "Technology" },
                { value: "other", label: "Other" },
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
                { value: "just-me", label: "Just me" },
                { value: "2-5", label: "2-5 people" },
                { value: "6-20", label: "6-20 people" },
                { value: "21-50", label: "21-50 people" },
                { value: "50+", label: "50+ people" },
              ]}
              value={formData.businessSize}
              onChange={(v) => onUpdate("businessSize", v)}
            />
          </div>
          <FieldError error={errors.businessSize} />
        </div>
        <div>
          <Label>How long has your business been operating? *</Label>
          <div className="mt-1.5">
            <RadioGroup
              name="yearsInBusiness"
              options={[
                { value: "pre-launch", label: "Pre-launch / idea stage" },
                { value: "less-than-1", label: "Less than 1 year" },
                { value: "1-3", label: "1-3 years" },
                { value: "3-10", label: "3-10 years" },
                { value: "10+", label: "10+ years" },
              ]}
              value={formData.yearsInBusiness}
              onChange={(v) => onUpdate("yearsInBusiness", v)}
            />
          </div>
          <FieldError error={errors.yearsInBusiness} />
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
}

function ServiceQuestionsStep({
  serviceId,
  formData,
  errors,
  onUpdateServiceAnswer,
}: {
  serviceId: string;
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdateServiceAnswer: IntakeStepProps["onUpdateServiceAnswer"];
}) {
  const module = getServiceModule(serviceId);
  if (!module) return null;

  const answers = formData.serviceAnswers[serviceId] ?? {};

  return (
    <div>
      <StepHeader title={module.serviceLabel} description={module.tagline} />
      <div className="space-y-6">
        {module.questions.map((q) => (
          <ServiceQuestionField
            key={q.id}
            question={q}
            value={answers[q.id] ?? (q.type === "checkbox" ? [] : "")}
            onChange={(v) => onUpdateServiceAnswer(serviceId, q.id, v)}
            error={errors[q.id]}
          />
        ))}
      </div>
    </div>
  );
}

function TimelineBudgetStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
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
                { value: "asap", label: "ASAP -- I needed this yesterday" },
                { value: "2-4-weeks", label: "2-4 weeks" },
                { value: "5-6-weeks", label: "5-6 weeks" },
                { value: "flexible", label: "Flexible -- quality over speed" },
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
                { value: "1k-5k", label: "$1,000 - $5,000" },
                { value: "5k-15k", label: "$5,000 - $15,000" },
                { value: "15k-30k", label: "$15,000 - $30,000" },
                { value: "30k+", label: "$30,000+" },
                { value: "unsure", label: "Not sure yet" },
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
}

function BudgetOnlyStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Budget"
        description="What investment range are you considering?"
      />
      <div>
        <Label>Investment Range *</Label>
        <div className="mt-1.5">
          <RadioGroup
            name="budgetRange"
            options={[
              { value: "1k-5k", label: "$1,000 - $5,000" },
              { value: "5k-15k", label: "$5,000 - $15,000" },
              { value: "15k-30k", label: "$15,000 - $30,000" },
              { value: "30k+", label: "$30,000+" },
              { value: "unsure", label: "Not sure yet" },
            ]}
            value={formData.budgetRange}
            onChange={(val) => onUpdate("budgetRange", val)}
          />
        </div>
        <FieldError error={errors.budgetRange} />
      </div>
    </div>
  );
}

function DesignBrandStep({
  formData,
  errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
  return (
    <div>
      <StepHeader
        title="Design & Brand"
        description="What look and feel resonates with your brand?"
      />
      <div className="space-y-5">
        <div>
          <Label>Design Preference *</Label>
          <div className="mt-1.5">
            <RadioGroup
              name="designPreference"
              options={[
                { value: "modern-minimal", label: "Modern & Minimal" },
                { value: "bold-energetic", label: "Bold & Energetic" },
                { value: "professional-corporate", label: "Professional & Corporate" },
                { value: "creative-unique", label: "Creative & Unique" },
                { value: "let-us-decide", label: "Let BuiltByBas decide" },
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
                { value: "yes-full", label: "Yes \u2014 logo, colors, brand guide" },
                { value: "yes-partial", label: "Partial \u2014 logo only" },
                { value: "no", label: "No \u2014 I need branding too" },
              ]}
              value={formData.hasBrandAssets}
              onChange={(v) => onUpdate("hasBrandAssets", v)}
            />
          </div>
          <FieldError error={errors.hasBrandAssets} />
        </div>
        <div>
          <Label htmlFor="brandColors">Brand Colors (optional)</Label>
          <Input
            id="brandColors"
            value={formData.brandColors}
            onChange={(e) => onUpdate("brandColors", e.target.value)}
            placeholder="Hex codes, color names, or describe your palette"
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="competitorSites">
            Competitor Websites (optional)
          </Label>
          <div className="mt-1.5">
            <TextArea
              id="competitorSites"
              value={formData.competitorSites}
              onChange={(v) => onUpdate("competitorSites", v)}
              placeholder="List competitor websites or businesses in your space"
              rows={3}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="inspirationSites">
            Websites You Admire (optional)
          </Label>
          <div className="mt-1.5">
            <TextArea
              id="inspirationSites"
              value={formData.inspirationSites}
              onChange={(v) => onUpdate("inspirationSites", v)}
              placeholder="URLs of websites you love (any industry)"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalStep({
  formData,
  errors: _errors,
  onUpdate,
}: {
  formData: IntakeFormData;
  errors: Record<string, string>;
  onUpdate: IntakeStepProps["onUpdate"];
}) {
  return (
    <div>
      <StepHeader
        title="Final Details"
        description="Almost done \u2014 share anything else that would help us understand your project."
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
                { value: "google", label: "Google Search" },
                { value: "social-media", label: "Social Media" },
                { value: "referral", label: "Referral" },
                { value: "other", label: "Other" },
              ]}
              value={formData.howDidYouHear}
              onChange={(v) => onUpdate("howDidYouHear", v)}
            />
          </div>
        </div>
        <div>
          <Label>Preferred Contact Method (optional)</Label>
          <div className="mt-1.5">
            <RadioGroup
              name="preferredContact"
              options={[
                { value: "email", label: "Email" },
                { value: "phone", label: "Phone" },
                { value: "text", label: "Text message" },
                { value: "any", label: "No preference" },
              ]}
              value={formData.preferredContact}
              onChange={(v) => onUpdate("preferredContact", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function IntakeStep({
  stepConfig,
  formData,
  errors,
  onUpdate,
  onUpdateServiceAnswer,
}: IntakeStepProps) {
  switch (stepConfig.type) {
    case "service-selection":
      return (
        <ServiceSelectionStep
          formData={formData}
          errors={errors}
          onUpdate={onUpdate}
        />
      );
    case "contact":
      return (
        <ContactStep formData={formData} errors={errors} onUpdate={onUpdate} />
      );
    case "business":
      return (
        <BusinessStep
          formData={formData}
          errors={errors}
          onUpdate={onUpdate}
        />
      );
    case "service-questions":
      return (
        <ServiceQuestionsStep
          serviceId={stepConfig.serviceId!}
          formData={formData}
          errors={errors}
          onUpdateServiceAnswer={onUpdateServiceAnswer}
        />
      );
    case "timeline-budget":
      return (
        <TimelineBudgetStep
          formData={formData}
          errors={errors}
          onUpdate={onUpdate}
        />
      );
    case "budget-only":
      return (
        <BudgetOnlyStep
          formData={formData}
          errors={errors}
          onUpdate={onUpdate}
        />
      );
    case "design-brand":
      return (
        <DesignBrandStep
          formData={formData}
          errors={errors}
          onUpdate={onUpdate}
        />
      );
    case "final":
      return (
        <FinalStep formData={formData} errors={errors} onUpdate={onUpdate} />
      );
    default:
      return null;
  }
}
