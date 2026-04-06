'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { logout } from '@/features/auth/actions/logout';

export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start gap-2"
      onClick={() => logout()}
    >
      <LogOut className="size-4" />
      로그아웃
    </Button>
  );
}
