'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

interface EventPublicUrlBarProps {
  slug: string;
}

export function EventPublicUrlBar({ slug }: EventPublicUrlBarProps) {
  const [copied, setCopied] = useState(false);

  const publicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${slug}`
      : `/${slug}`;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}/${slug}`
        : `/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-3 py-1.5 text-sm">
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
        {publicUrl}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        title="URL 복사"
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5 text-green-600" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <a
        href={`/${slug}`}
        target="_blank"
        rel="noopener noreferrer"
        title="공개 페이지 열기"
        onClick={(e) => e.stopPropagation()}
        className="shrink-0 rounded p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ExternalLink className="size-3.5" />
      </a>
    </div>
  );
}
