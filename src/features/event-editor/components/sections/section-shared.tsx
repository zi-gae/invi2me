import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  label?: string;
  title: string;
  className?: string;
}

export function SectionHeader({ label, title, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-12 text-center', className)}>
      {label && (
        <span className="text-[11px] tracking-[0.35em] text-stone-400 uppercase">{label}</span>
      )}
      <h2
        className={cn(
          'font-light tracking-wide text-stone-700',
          label ? 'mt-2 text-2xl' : 'text-2xl',
        )}
      >
        {title}
      </h2>
      <div className="mx-auto mt-4 h-px w-8 bg-stone-300" />
    </div>
  );
}

export function Ornament({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <div className="h-px w-10 bg-stone-200" />
      <span className="select-none text-sm text-stone-300" aria-hidden="true">
        ✦
      </span>
      <div className="h-px w-10 bg-stone-200" />
    </div>
  );
}
