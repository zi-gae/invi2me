import { Ornament } from './section-shared';

interface ParentNames {
  father?: string;
  mother?: string;
}

export function InvitationMessageSection({ props }: { props: Record<string, unknown> }) {
  const message = (props.message as string) ?? '';
  const groomParents = props.groomParents as ParentNames | undefined;
  const brideParents = props.brideParents as ParentNames | undefined;
  const groomName = (props.groomName as string) ?? '';
  const brideName = (props.brideName as string) ?? '';

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xs text-center sm:max-w-sm">
        <Ornament />
        {message && (
          <p className="mt-10 whitespace-pre-line text-[15px] leading-loose tracking-wide text-stone-600">
            {message}
          </p>
        )}
        {(groomParents || brideParents) && (
          <div className="mt-12 space-y-3 text-sm text-stone-500">
            {groomParents && (
              <p>
                {[groomParents.father, groomParents.mother].filter(Boolean).join(' · ')}
                {groomName && (
                  <span className="ml-1 text-stone-800">의 아들 {groomName}</span>
                )}
              </p>
            )}
            {brideParents && (
              <p>
                {[brideParents.father, brideParents.mother].filter(Boolean).join(' · ')}
                {brideName && (
                  <span className="ml-1 text-stone-800">의 딸 {brideName}</span>
                )}
              </p>
            )}
          </div>
        )}
        <Ornament className="mt-12" />
      </div>
    </section>
  );
}
