'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryImage {
  url: string;
  alt?: string;
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%' }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%' }),
};

export function GallerySection({ props }: { props: Record<string, unknown> }) {
  const images = (props.images as GalleryImage[]) ?? [];
  const title = (props.title as string) ?? '';

  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  function go(index: number) {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }

  function prev() {
    go((current - 1 + images.length) % images.length);
  }

  function next() {
    go((current + 1) % images.length);
  }

  if (images.length === 0) {
    return (
      <section className="bg-stone-900 px-6 py-16">
        <span className="block text-center text-[11px] tracking-[0.35em] text-stone-600 uppercase">
          GALLERY
        </span>
        <div className="mt-6 grid grid-cols-2 gap-0.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-stone-800" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-stone-900">
      {title && (
        <div className="px-6 pb-6 pt-16 text-center">
          <span className="text-[11px] tracking-[0.35em] text-stone-500 uppercase">
            GALLERY
          </span>
          <p className="mt-1 text-base font-light text-stone-300">{title}</p>
        </div>
      )}
      {!title && <div className="pt-16" />}

      {/* 메인 슬라이더 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next();
              else if (info.offset.x > 50) prev();
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <Image
              src={images[current].url}
              alt={images[current].alt ?? `갤러리 ${current + 1}`}
              fill
              className="pointer-events-none object-cover"
              sizes="375px"
              priority={current === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* 좌우 탐색 버튼 */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="이전 사진"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={next}
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/30 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label="다음 사진"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* 카운터 배지 */}
        <div className="absolute right-3 bottom-3 rounded-full bg-black/40 px-2.5 py-0.5 font-light text-[11px] tracking-widest text-white/80 backdrop-blur-sm">
          {current + 1} / {images.length}
        </div>
      </div>

      {/* 도트 인디케이터 */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                i === current
                  ? 'w-5 bg-stone-300'
                  : 'w-1.5 bg-stone-600 hover:bg-stone-500',
              )}
              aria-label={`${i + 1}번 사진으로 이동`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
