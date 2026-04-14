import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type MilestoneInfo = {
  title: string;
  subtitle: string;
  dateRange: string;
};

const MILESTONE_INFO: Record<string, MilestoneInfo> = {
  "final-exams": {
    title: "Final Exams",
    subtitle: "Milestone Reference",
    dateRange: "May 11 - May 22, 2026",
  },
  "thesis-defense": {
    title: "Thesis Defense",
    subtitle: "Milestone Reference",
    dateRange: "May 18 - May 22, 2026",
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
          Date: {milestone.dateRange}. This page shows the calendar schedule image you provided for quick reference.
        </p>

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

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="/calander.jpg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
          >
            More Info
          </a>
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
