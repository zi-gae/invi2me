'use client';

import { useState, useCallback, useId } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

// ─── Shared field primitives ─────────────────────────────────────────────────

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export function Field({ label, hint, children }: FieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-stone-600">
        {label}
        {hint && <span className="ml-1 font-normal text-stone-400">({hint})</span>}
      </Label>
      {/* clone child to inject id */}
      <div id={id}>{children}</div>
    </div>
  );
}

interface TextFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

export function TextField({ label, hint, value, onChange, placeholder, type = 'text' }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-600">
        {label}
        {hint && <span className="ml-1 font-normal text-stone-400">({hint})</span>}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-sm"
      />
    </div>
  );
}

interface TextareaFieldProps {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextareaField({ label, hint, value, onChange, placeholder, rows = 4 }: TextareaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-600">
        {label}
        {hint && <span className="ml-1 font-normal text-stone-400">({hint})</span>}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="resize-none text-sm"
      />
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className="h-px flex-1 bg-stone-100" />
      <span className="text-[11px] tracking-wide text-stone-400 uppercase">{label}</span>
      <div className="h-px flex-1 bg-stone-100" />
    </div>
  );
}

// ─── Dynamic array field ──────────────────────────────────────────────────────

type RowFields<T> = {
  [K in keyof T]: {
    label: string;
    placeholder?: string;
    type?: string;
    width?: string;
  };
};

interface ArrayFieldProps<T extends object> {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  emptyItem: T;
  fields: RowFields<T>;
  addLabel?: string;
}

export function ArrayField<T extends object>({
  label,
  items,
  onChange,
  emptyItem,
  fields,
  addLabel = '항목 추가',
}: ArrayFieldProps<T>) {
  const fieldKeys = Object.keys(fields) as (keyof T)[];

  function addRow() {
    onChange([...items, { ...emptyItem }]);
  }

  function removeRow(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, key: keyof T, value: string) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-stone-600">{label}</label>
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-1.5 rounded-lg border border-stone-100 bg-stone-50 p-2.5">
          <div className="grid flex-1 gap-2" style={{ gridTemplateColumns: `repeat(${fieldKeys.length}, 1fr)` }}>
            {fieldKeys.map((key) => {
              const field = fields[key];
              return (
                <Input
                  key={String(key)}
                  type={field.type ?? 'text'}
                  value={(item[key] as string) ?? ''}
                  onChange={(e) => updateRow(i, key, e.target.value)}
                  placeholder={field.placeholder ?? field.label}
                  className="h-7 text-xs"
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => removeRow(i)}
            className="mt-0.5 rounded p-1 text-stone-400 hover:bg-stone-200 hover:text-destructive"
            aria-label={`${i + 1}번 항목 삭제`}
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addRow} className="h-7 text-xs">
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

// ─── Props extraction helpers ─────────────────────────────────────────────────

export function str(props: Record<string, unknown>, key: string, fallback = ''): string {
  return (props[key] as string | undefined) ?? fallback;
}

export function num(props: Record<string, unknown>, key: string, fallback = 0): number {
  return (props[key] as number | undefined) ?? fallback;
}

export function arr<T>(props: Record<string, unknown>, key: string): T[] {
  return (props[key] as T[] | undefined) ?? [];
}

export function obj<T>(props: Record<string, unknown>, key: string): Partial<T> {
  return (props[key] as Partial<T> | undefined) ?? {};
}
