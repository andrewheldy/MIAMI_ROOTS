"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { ArrowRightIcon } from "@/components/ui/icons";
import { communityGroups } from "@/features/groups/content";

type Slug = (typeof communityGroups)[number]["slug"];

interface Answer {
  label: string;
  description: string;
  scores: Partial<Record<Slug, number>>;
}

interface Question {
  prompt: string;
  helper: string;
  answers: readonly Answer[];
}

const questions: readonly Question[] = [
  {
    prompt: "What would make Miami feel more like yours?",
    helper: "Choose the feeling you want more of right now.",
    answers: [
      {
        label: "A familiar circle",
        description: "People to talk with, ask, and make everyday plans with.",
        scores: { "general-chat": 3, "sober-social": 1 },
      },
      {
        label: "A project with momentum",
        description: "Collaborators, useful introductions, and shared ideas.",
        scores: {
          "business-and-connections": 3,
          "community-organizing": 2,
        },
      },
      {
        label: "More reasons to go out",
        description: "Plans, experiences, and people who want to do things.",
        scores: {
          "nightlife-and-event-marketing": 2,
          "daytime-events": 2,
        },
      },
      {
        label: "A way to contribute",
        description: "Local action that turns intention into something useful.",
        scores: { "community-organizing": 4, "general-chat": 1 },
      },
    ],
  },
  {
    prompt: "Which rhythm sounds most like you?",
    helper: "There is no right answer—and you can always explore every space.",
    answers: [
      {
        label: "Sun out, shoes on",
        description: "Movement, wellness, outdoors, and daytime plans.",
        scores: { "daytime-events": 4, "community-organizing": 1 },
      },
      {
        label: "Miami after dark",
        description:
          "Nights out, live energy, and people making events happen.",
        scores: { "nightlife-and-event-marketing": 4 },
      },
      {
        label: "Social, just alcohol-free",
        description: "Clear-headed plans without missing Miami's energy.",
        scores: { "sober-social": 5, "daytime-events": 1 },
      },
      {
        label: "It depends on the day",
        description: "Give me variety and a welcoming place to start.",
        scores: { "general-chat": 3, "daytime-events": 1 },
      },
    ],
  },
  {
    prompt: "How do you naturally enter a new room?",
    helper: "This helps us suggest the kind of community role that may fit.",
    answers: [
      {
        label: "I start a conversation",
        description: "I like learning who people are and what they know.",
        scores: { "general-chat": 3, "business-and-connections": 1 },
      },
      {
        label: "I make the plan",
        description: "I am usually the one getting everyone together.",
        scores: {
          "nightlife-and-event-marketing": 2,
          "community-organizing": 2,
        },
      },
      {
        label: "I bring an idea",
        description: "I look for people who want to build something together.",
        scores: {
          "business-and-connections": 3,
          "community-organizing": 2,
        },
      },
      {
        label: "I join the activity",
        description: "Doing something together makes introductions easier.",
        scores: { "daytime-events": 2, "sober-social": 2 },
      },
    ],
  },
] as const;

export function CommunityFinder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const results = useMemo(() => {
    const scores = new Map<Slug, number>();

    answers.forEach((answerIndex, questionIndex) => {
      const answer = questions[questionIndex]?.answers[answerIndex];
      if (!answer) return;

      Object.entries(answer.scores).forEach(([slug, score]) => {
        if (score === undefined) return;
        scores.set(slug as Slug, (scores.get(slug as Slug) ?? 0) + score);
      });
    });

    return [...communityGroups]
      .sort((a, b) => (scores.get(b.slug) ?? 0) - (scores.get(a.slug) ?? 0))
      .slice(0, 2);
  }, [answers]);

  const question = questions[step];
  const isComplete = step >= questions.length;

  function choose(answerIndex: number) {
    setAnswers((current) => [...current, answerIndex]);
    setStep((current) => current + 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
  }

  if (isComplete) {
    return (
      <div aria-live="polite">
        <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
          Your starting points
        </p>
        <h2 className="font-display text-forest mt-5 max-w-3xl text-4xl leading-none font-semibold tracking-[-0.05em] sm:text-6xl">
          Two doors into the network.
        </h2>
        <p className="text-muted mt-6 max-w-2xl leading-relaxed">
          This is a lightweight guide, not a profile or personality score. No
          answers were saved. Explore either space—or ignore the result and
          browse all six.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {results.map((group, index) => (
            <Link
              key={group.slug}
              href={`/groups/${group.slug}`}
              className={`community-card--${group.tone} group rounded-[2rem] p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-9`}
            >
              <p className="text-forest/55 text-xs font-semibold tracking-[0.16em] uppercase">
                {index === 0 ? "Strongest match" : "Also worth exploring"}
              </p>
              <h3 className="font-display text-forest mt-16 text-4xl font-semibold tracking-[-0.05em]">
                {group.name}
              </h3>
              <p className="text-forest/70 mt-4 leading-relaxed">
                {group.shortDescription}
              </p>
              <span className="text-forest mt-8 inline-flex items-center gap-2 text-sm font-semibold">
                Explore this community
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-5">
          <button
            type="button"
            onClick={reset}
            className="text-forest hover:text-forest-600 text-sm font-semibold underline decoration-1 underline-offset-4"
          >
            Start again
          </button>
          <Link
            href="/groups"
            className="text-forest hover:text-forest-600 text-sm font-semibold underline decoration-1 underline-offset-4"
          >
            Browse every community
          </Link>
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <p className="text-forest/55 text-xs font-semibold tracking-[0.18em] uppercase">
          Question {step + 1} of {questions.length}
        </p>
        <div className="flex gap-2" aria-hidden="true">
          {questions.map((item, index) => (
            <span
              key={item.prompt}
              className={`h-1.5 w-8 rounded-full ${index <= step ? "bg-forest" : "bg-forest/15"}`}
            />
          ))}
        </div>
      </div>
      <h2 className="font-display text-forest mt-7 max-w-4xl text-4xl leading-[0.98] font-semibold tracking-[-0.05em] sm:text-6xl">
        {question.prompt}
      </h2>
      <p className="text-muted mt-5">{question.helper}</p>

      <div className="mt-10 grid gap-3 md:grid-cols-2">
        {question.answers.map((answer, index) => (
          <button
            key={answer.label}
            type="button"
            onClick={() => choose(index)}
            className="border-forest/12 bg-background hover:bg-mint-100 focus-visible:bg-mint-100 group rounded-2xl border p-6 text-left transition-colors sm:p-7"
          >
            <span className="text-forest flex items-center justify-between gap-4 text-lg font-semibold">
              {answer.label}
              <ArrowRightIcon className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="text-muted mt-3 block text-sm leading-relaxed">
              {answer.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
