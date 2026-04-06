// Event Themes DTOs

export interface EventTemplateDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  eventType: string;
  category: string;
  isSystem: boolean;
  isPublic: boolean;
  previewImageUrl: string | null;
}

export interface EventThemeDto {
  id: string;
  name: string;
  themeTokens: Record<string, unknown>;
  fontTokens: Record<string, unknown>;
  radiusTokens: Record<string, unknown>;
  shadowTokens: Record<string, unknown>;
  motionTokens: Record<string, unknown>;
}

export interface CustomDomainDto {
  id: string;
  workspaceId: string;
  domain: string;
  status: string;
  sslStatus: string;
  connectedAt: string | null;
}
