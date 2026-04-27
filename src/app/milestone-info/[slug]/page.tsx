import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type MilestoneInfo = {
  title: string;
  subtitle: string;
  dateRange: string;
  externalLink?: { href: string; label: string; description: string };
};

const MILESTONE_INFO: Record<string, MilestoneInfo> = {
  "thesis-defense": {
    title: "5th Year CSE & SE Grad Defence",
    subtitle: "Milestone Reference",
    dateRange: "May 7, 2026",
    externalLink: {
      href: "https://t.me/csegrad2018/559",
      label: "View on Telegram",
      description:
        "Full details, schedule, and announcements for the 5th Year CSE & SE Graduation Defence are available on the official Telegram channel.",
    },
  },
  "final-exams": {
    title: "Final Exams",
    subtitle: "Milestone Reference",
    dateRange: "May 11 - May 22, 2026",
  },
  "exit-exam": {
    title: "Exit Exam",
    subtitle: "Milestone Reference",
    dateRange: "June 10 - June 17, 2026",
  },
  "graduation-day": {
    title: "Graduation Day",
    subtitle: "Milestone Reference",
    dateRange: "June 20, 2026",
  },
};

export default async function MilestoneInfoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const milestone = MILESTONE_INFO[slug];

  if (!milestone) {
    notFound();
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(145deg,#020617,#09090b_45%,#140b2c)]" />

      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/75">{milestone.subtitle}</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-4xl">{milestone.title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-blue-100/80 sm:text-base">
          Date: {milestone.dateRange}.{" "}
          {milestone.externalLink
            ? milestone.externalLink.description
            : "This page shows the calendar schedule image you provided for quick reference."}
        </p>

        {milestone.externalLink ? (
          /* ── Telegram link card ── */
          <section className="mt-6 rounded-3xl border border-white/15 bg-white/6 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Telegram icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-500/10 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-10 w-10 text-cyan-400"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-white sm:text-xl">
                  Official Telegram Announcement
                </p>
                <p className="text-sm text-blue-100/70 sm:text-base">
                  Tap the button below to open the full announcement on Telegram.
                </p>
              </div>

              <a
                href={milestone.externalLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2.5 rounded-xl border border-cyan-300/40 bg-cyan-500/20 px-6 py-3 text-base font-semibold text-cyan-100 shadow-lg transition hover:bg-cyan-500/35 hover:shadow-cyan-500/20 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                {milestone.externalLink.label}
              </a>

              <p className="text-xs text-white/30">
                {milestone.externalLink.href}
              </p>
            </div>
          </section>
        ) : (
          /* ── Calendar image (default) ── */
          <section className="mt-6 rounded-3xl border border-white/15 bg-white/6 p-3 shadow-2xl backdrop-blur-xl sm:p-5">
            <Image
              src="/calander.jpg"
              alt={`${milestone.title} calendar schedule`}
              width={1400}
              height={900}
              priority
              className="h-auto w-full rounded-2xl border border-white/15 object-cover"
            />
          </section>
        )}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          {!milestone.externalLink && (
            <a
              href="/calander.jpg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
            >
              More Info
            </a>
          )}
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
