// Organization DTOs

export interface OrganizationDto {
  id: string;
  workspaceId: string;
  slug: string;
  name: string;
  businessType: string;
  brandName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  status: string;
  createdAt: string;
}

export interface OrgMemberDto {
  id: string;
  userId: string;
  userName: string;
  userEmail: string; // masked
  role: string;
  permissions: string[];
  status: string;
  createdAt: string;
}
