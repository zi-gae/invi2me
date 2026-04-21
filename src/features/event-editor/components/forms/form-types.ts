export interface FormProps {
  props: Record<string, unknown>;
  onChange: (updated: Record<string, unknown>) => void;
  eventId: string;
}

export type Setter = (patch: Record<string, unknown>) => void;

export function patch(props: Record<string, unknown>, onChange: (v: Record<string, unknown>) => void): Setter {
  return (update) => onChange({ ...props, ...update });
}
