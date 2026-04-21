const YT_PATTERN = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//;

export function VideoSection({ props }: { props: Record<string, unknown> }) {
  const videoUrl = props.videoUrl as string | undefined;
  const title = (props.title as string) ?? '';

  if (!videoUrl || !YT_PATTERN.test(videoUrl)) return null;

  const embedUrl = videoUrl
    .replace(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      'https://www.youtube.com/embed/$1',
    )
    .replace(
      /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
      'https://www.youtube.com/embed/$1',
    );

  return (
    <section className="bg-stone-900">
      {title && (
        <div className="px-6 pb-4 pt-16 text-center sm:pt-20">
          <p className="text-base font-light text-stone-300">{title}</p>
        </div>
      )}
      <div className="aspect-video w-full">
        <iframe
          src={embedUrl}
          title={title || '웨딩 영상'}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );
}
