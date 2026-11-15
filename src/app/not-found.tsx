import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <span className="text-xs uppercase tracking-widest font-extrabold text-[#065F46] bg-[#E6F4EE] px-3 py-1 rounded-full mb-3">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102820] mb-3">
        Looking for Care?
      </h1>
      <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
        The healthcare service or page you requested could not be located. Browse our medical directory or return to the homepage.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-[#064E3B] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#065F46] transition-colors"
        >
          Return to Homepage
        </Link>
        <Link
          href="/services"
          className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-xs font-bold text-[#102820] hover:bg-slate-50 transition-colors"
        >
          Explore Services
        </Link>
      </div>
    </div>
  );
}
