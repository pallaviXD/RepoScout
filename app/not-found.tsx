import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-foreground tracking-tight font-mono">404 — Not Found</h1>
      <p className="text-sm text-secondary-foreground max-w-md mx-auto">
        The repository, issue, or page you were looking for could not be found or does not exist.
      </p>
      <div className="pt-2">
        <Link href="/explore">
          <Button variant="primary" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Return to Explore Repositories
          </Button>
        </Link>
      </div>
    </div>
  );
}
