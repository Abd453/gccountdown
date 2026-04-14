import Link from "next/link";
import Image from "next/image";

const SOURCE_URL = "#";

export default function ExitExamModelPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_85%_10%,rgba(168,85,247,0.18),transparent_34%),linear-gradient(145deg,#020617,#09090b_45%,#140b2c)]" />
      <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200/75">Exit Exam Resource</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight sm:text-4xl">Exit Exam Model - Friday, April 17</h1>
        <p className="mt-3 max-w-3xl text-sm text-blue-100/80 sm:text-base">
          This page contains the shared model calendar image for the exit exam planning day. Use it as a quick
          reference while preparing your schedule.
        </p>

        <section className="mt-6 rounded-3xl border border-white/15 bg-white/6 p-3 shadow-2xl backdrop-blur-xl sm:p-5">
          <Image
            src="/calander.jpg"
            alt="Exit exam model calendar"
            width={1400}
            height={900}
            priority
            className="h-auto w-full rounded-2xl border border-white/15 object-cover"
          />
        </section>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href={SOURCE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25"
          >
            More Info Source
          </a>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to Dashboard
          </Link>
        </div>

        <p className="mt-3 text-xs text-blue-100/60">
          Source link placeholder is currently set. Replace SOURCE_URL in this page when you want to attach the final
          reference link.
        </p>
      </div>
    </main>
  );
}
