"use client";

import { useActionState, useId, useState } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/cn";
import { NOMINATION_LIMITS, type NominationField } from "@/lib/connectors";

import { submitNomination } from "./actions";
import {
  initialNominationState,
  type NominationState,
} from "./nomination-state";

/**
 * The Founding Connector interest / nomination form.
 *
 * A progressively-enhanced Server Action form: it posts and works without
 * client JavaScript, and the client layer only adds the conditional
 * "your name" field, inline errors, and a pending state.
 *
 * Only rendered when a real write path exists — the page checks
 * `isNominationCaptureConfigured()` and renders a direct-contact route
 * instead when it does not, so this form never accepts a submission it
 * cannot store.
 */

const errorText = "text-danger text-sm";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }
  return (
    <p id={id} className={cn(errorText, "mt-1.5")}>
      {message}
    </p>
  );
}

const inputClass =
  "border-border bg-background text-foreground placeholder:text-muted/70 min-h-12 w-full rounded-lg border px-3.5 py-2.5 text-base transition-colors focus:border-forest/50";
const labelClass = "text-forest block text-sm font-semibold";
const hintClass = "text-muted mt-1 text-sm leading-relaxed";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-forest text-background hover:bg-forest-600 inline-flex min-h-12 w-full items-center justify-center rounded-lg px-6 text-sm font-semibold transition-[background-color,transform] disabled:opacity-70 motion-safe:active:scale-[0.99] sm:w-auto"
    >
      {pending ? "Sending…" : "Send it over"}
    </button>
  );
}

export function NominationForm() {
  const [state, formAction] = useActionState<NominationState, FormData>(
    submitNomination,
    initialNominationState,
  );
  const [kind, setKind] = useState<"self" | "other">("self");
  const uid = useId();

  const id = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;
  const errorFor = (field: NominationField): string | undefined =>
    state.status === "invalid" ? state.errors[field] : undefined;
  const describedBy = (field: NominationField, ...extra: string[]) =>
    [...extra, errorFor(field) ? errorId(field) : null]
      .filter(Boolean)
      .join(" ") || undefined;

  if (state.status === "success") {
    return (
      <div
        role="status"
        className="border-forest/25 bg-mint-100 rounded-xl border p-6"
      >
        <p className="text-forest text-lg font-semibold">Got it — thank you.</p>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          It&apos;s saved and a real person will read it. We answer everyone we
          decide to move forward with; because the cohort is small, we
          can&apos;t take everyone, and that isn&apos;t a judgment of anyone. If
          it&apos;s a fit, you&apos;ll hear from us directly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="mt-8 space-y-6">
      {/* Non-field outcomes announced politely, above the form. */}
      <div aria-live="polite">
        {state.status === "invalid" ? (
          <p className={errorText}>
            A few fields need another look — details are below.
          </p>
        ) : null}
        {state.status === "unavailable" ? (
          <div className="border-border bg-surface rounded-xl border p-5">
            <p className="text-forest font-semibold">
              We couldn&apos;t save that — and we won&apos;t pretend we did.
            </p>
            <p className={hintClass}>
              Nomination storage isn&apos;t switched on in this environment.
              Nothing you typed was recorded. Come say hello in the{" "}
              <a href="/join" className="text-forest font-medium underline">
                General Chat
              </a>{" "}
              and tell an admin you&apos;re interested — that reaches us today.
            </p>
          </div>
        ) : null}
        {state.status === "error" ? (
          <div className="border-border bg-surface rounded-xl border p-5">
            <p className="text-forest font-semibold">
              Something broke on our end.
            </p>
            <p className={hintClass}>
              Your nomination was not saved. Please try again in a minute, or
              reach us through the{" "}
              <a href="/join" className="text-forest font-medium underline">
                General Chat
              </a>
              .
            </p>
          </div>
        ) : null}
      </div>

      <fieldset>
        <legend className={labelClass}>Who is this for?</legend>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:gap-3">
          {(
            [
              { value: "self", label: "It's me" },
              { value: "other", label: "I'm nominating someone" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className={cn(
                "border-border flex min-h-12 flex-1 cursor-pointer items-center gap-3 rounded-lg border px-4 text-sm transition-colors",
                kind === option.value
                  ? "border-forest/50 bg-mint-100 text-forest font-semibold"
                  : "bg-background text-muted",
              )}
            >
              <input
                type="radio"
                name="kind"
                value={option.value}
                checked={kind === option.value}
                onChange={() => setKind(option.value)}
                className="accent-forest size-4"
              />
              {option.label}
            </label>
          ))}
        </div>
        <FieldError id={errorId("kind")} message={errorFor("kind")} />
      </fieldset>

      <div>
        <label htmlFor={id("nomineeName")} className={labelClass}>
          {kind === "self" ? "Your name" : "Their name"}
        </label>
        <input
          id={id("nomineeName")}
          name="nomineeName"
          type="text"
          required
          maxLength={NOMINATION_LIMITS.name.max}
          autoComplete={kind === "self" ? "name" : "off"}
          aria-invalid={Boolean(errorFor("nomineeName"))}
          aria-describedby={describedBy("nomineeName")}
          className={cn(inputClass, "mt-2")}
        />
        <FieldError
          id={errorId("nomineeName")}
          message={errorFor("nomineeName")}
        />
      </div>

      {kind === "other" ? (
        <div>
          <label htmlFor={id("nominatorName")} className={labelClass}>
            And your name
          </label>
          <input
            id={id("nominatorName")}
            name="nominatorName"
            type="text"
            maxLength={NOMINATION_LIMITS.name.max}
            autoComplete="name"
            aria-invalid={Boolean(errorFor("nominatorName"))}
            aria-describedby={describedBy(
              "nominatorName",
              id("nominatorName-hint"),
            )}
            className={cn(inputClass, "mt-2")}
          />
          <p id={id("nominatorName-hint")} className={hintClass}>
            We ask you for their contact, not the form — if it&apos;s a fit,
            we&apos;ll come back to you for the intro.
          </p>
          <FieldError
            id={errorId("nominatorName")}
            message={errorFor("nominatorName")}
          />
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-[minmax(0,10rem)_1fr]">
        <div>
          <label htmlFor={id("contactMethod")} className={labelClass}>
            Reach you by
          </label>
          <select
            id={id("contactMethod")}
            name="contactMethod"
            defaultValue="instagram"
            aria-invalid={Boolean(errorFor("contactMethod"))}
            aria-describedby={describedBy("contactMethod")}
            className={cn(inputClass, "mt-2")}
          >
            <option value="instagram">Instagram DM</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="other">Something else</option>
          </select>
          <FieldError
            id={errorId("contactMethod")}
            message={errorFor("contactMethod")}
          />
        </div>
        <div>
          <label htmlFor={id("contactValue")} className={labelClass}>
            Where to find you
          </label>
          <input
            id={id("contactValue")}
            name="contactValue"
            type="text"
            required
            maxLength={NOMINATION_LIMITS.contact.max}
            placeholder="@yourhandle, an email, or a number"
            aria-invalid={Boolean(errorFor("contactValue"))}
            aria-describedby={describedBy("contactValue")}
            className={cn(inputClass, "mt-2")}
          />
          <FieldError
            id={errorId("contactValue")}
            message={errorFor("contactValue")}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("neighborhood")} className={labelClass}>
            Neighborhood or area
          </label>
          <input
            id={id("neighborhood")}
            name="neighborhood"
            type="text"
            required
            maxLength={NOMINATION_LIMITS.neighborhood.max}
            placeholder="Little Havana, Wynwood, Brickell…"
            aria-invalid={Boolean(errorFor("neighborhood"))}
            aria-describedby={describedBy("neighborhood")}
            className={cn(inputClass, "mt-2")}
          />
          <FieldError
            id={errorId("neighborhood")}
            message={errorFor("neighborhood")}
          />
        </div>
        <div>
          <label htmlFor={id("communityRole")} className={labelClass}>
            What {kind === "self" ? "you do" : "they do"} here
          </label>
          <input
            id={id("communityRole")}
            name="communityRole"
            type="text"
            required
            maxLength={NOMINATION_LIMITS.role.max}
            placeholder="Run a run club, bartend at…, book shows…"
            aria-invalid={Boolean(errorFor("communityRole"))}
            aria-describedby={describedBy("communityRole")}
            className={cn(inputClass, "mt-2")}
          />
          <FieldError
            id={errorId("communityRole")}
            message={errorFor("communityRole")}
          />
        </div>
      </div>

      <div>
        <label htmlFor={id("instagram")} className={labelClass}>
          Instagram <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          id={id("instagram")}
          name="instagram"
          type="text"
          maxLength={NOMINATION_LIMITS.instagram.max}
          placeholder="@handle"
          aria-invalid={Boolean(errorFor("instagram"))}
          aria-describedby={describedBy("instagram", id("instagram-hint"))}
          className={cn(inputClass, "mt-2")}
        />
        <p id={id("instagram-hint")} className={hintClass}>
          Only if it helps us place who you mean. Follower count is not what
          we&apos;re looking at.
        </p>
        <FieldError id={errorId("instagram")} message={errorFor("instagram")} />
      </div>

      <div>
        <label htmlFor={id("why")} className={labelClass}>
          {kind === "self"
            ? "Who do you bring together, and how?"
            : "Why would they be a strong connector?"}
        </label>
        <textarea
          id={id("why")}
          name="why"
          required
          rows={5}
          minLength={NOMINATION_LIMITS.why.min}
          maxLength={NOMINATION_LIMITS.why.max}
          aria-invalid={Boolean(errorFor("why"))}
          aria-describedby={describedBy("why", id("why-hint"))}
          className={cn(inputClass, "mt-2 min-h-32 resize-y leading-relaxed")}
        />
        <p id={id("why-hint")} className={hintClass}>
          A few real sentences beat a pitch. Who have you actually introduced,
          and what came of it?
        </p>
        <FieldError id={errorId("why")} message={errorFor("why")} />
      </div>

      <div>
        <label htmlFor={id("referralSource")} className={labelClass}>
          How did you hear about this?{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          id={id("referralSource")}
          name="referralSource"
          type="text"
          maxLength={NOMINATION_LIMITS.referralSource.max}
          placeholder="A card someone tapped, a friend, the group chat…"
          aria-invalid={Boolean(errorFor("referralSource"))}
          aria-describedby={describedBy("referralSource")}
          className={cn(inputClass, "mt-2")}
        />
        <FieldError
          id={errorId("referralSource")}
          message={errorFor("referralSource")}
        />
      </div>

      {/* Honeypot: hidden from people and assistive tech, irresistible to bots. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={id("website")}>Website</label>
        <input
          id={id("website")}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="border-border bg-surface rounded-xl border p-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input
            type="checkbox"
            name="consentToContact"
            value="on"
            required
            aria-invalid={Boolean(errorFor("consentToContact"))}
            aria-describedby={describedBy("consentToContact")}
            className="accent-forest mt-0.5 size-4 shrink-0"
          />
          <span className="text-muted leading-relaxed">
            You can contact me about the Founding Connector program. We keep
            what&apos;s on this form, use it only to talk to you about this, and
            delete it if you&apos;re not moving forward.
          </span>
        </label>
        <FieldError
          id={errorId("consentToContact")}
          message={errorFor("consentToContact")}
        />
      </div>

      <SubmitButton />
    </form>
  );
}
