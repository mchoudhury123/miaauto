import Link from "next/link";
import { Home, Car } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink-900 px-6 text-center text-white">
      <p className="font-display text-7xl font-bold text-green-500">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-300">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          <Home className="h-4 w-4" />
          Back home
        </Link>
        <Link
          href="/inventory"
          className="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10"
        >
          <Car className="h-4 w-4" />
          Browse stock
        </Link>
      </div>
    </div>
  );
}
