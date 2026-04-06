// Workspace DTOs

export interface WorkspaceDto {
  id: string;
  slug: string;
  name: string;
  type: string;
  planCode: string;
  status: string;
  defaultLocale: string;
  defaultTimezone: string;
  createdAt: string;
}

export interface WorkspaceMemberDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string; // masked
  role: string;
  permissions: string[];
  status: string;
  createdAt: string;
}
