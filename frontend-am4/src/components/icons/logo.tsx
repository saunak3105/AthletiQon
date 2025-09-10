import { Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Dumbbell className="h-8 w-8 text-primary" />
      <span className="font-headline text-2xl font-bold">AthletiQon</span>
    </div>
  );
}
