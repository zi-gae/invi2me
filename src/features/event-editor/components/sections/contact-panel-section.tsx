import { Phone } from 'lucide-react';
import { SectionHeader } from './section-shared';

interface ContactPerson {
  name: string;
  relation: string;
  phone: string;
}

export function ContactPanelSection({ props }: { props: Record<string, unknown> }) {
  const groomContacts = (props.groomContacts as ContactPerson[]) ?? [];
  const brideContacts = (props.brideContacts as ContactPerson[]) ?? [];

  return (
    <section className="bg-white px-6 py-20 sm:py-24">
      <SectionHeader label="CONTACT" title="연락처" />
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
        {/* Groom side */}
        <div>
          <p className="mb-3 text-center text-[11px] tracking-[0.25em] text-stone-400">
            신랑측
          </p>
          <div className="space-y-2">
            {groomContacts.map((contact, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-3 text-center"
              >
                <p className="text-xs text-stone-400">{contact.relation}</p>
                <p className="mt-0.5 text-sm font-medium text-stone-700">{contact.name}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-2 flex items-center justify-center gap-1 text-xs text-stone-500 hover:text-rose-400"
                >
                  <Phone className="size-3" aria-hidden="true" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bride side */}
        <div>
          <p className="mb-3 text-center text-[11px] tracking-[0.25em] text-stone-400">
            신부측
          </p>
          <div className="space-y-2">
            {brideContacts.map((contact, i) => (
              <div
                key={i}
                className="rounded-xl border border-stone-100 bg-stone-50 px-3 py-3 text-center"
              >
                <p className="text-xs text-stone-400">{contact.relation}</p>
                <p className="mt-0.5 text-sm font-medium text-stone-700">{contact.name}</p>
                <a
                  href={`tel:${contact.phone}`}
                  className="mt-2 flex items-center justify-center gap-1 text-xs text-stone-500 hover:text-rose-400"
                >
                  <Phone className="size-3" aria-hidden="true" />
                  <span>{contact.phone}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
