// Messaging DTOs

export interface CampaignDto {
  id: string;
  eventId: string;
  channelType: string;
  name: string;
  status: string;
  messageTemplateId: string | null;
  scheduledAt: string | null;
  totalDeliveries: number;
  sentCount: number;
  failedCount: number;
  createdAt: string;
}

export interface CampaignDeliveryDto {
  id: string;
  campaignId: string;
  guestId: string;
  guestName: string;
  status: string;
  sentAt: string | null;
  deliveredAt: string | null;
  openedAt: string | null;
  errorMessage: string | null;
}

export interface MessageTemplateDto {
  id: string;
  channelType: string;
  name: string;
  subjectTemplate: string | null;
  bodyTemplate: string;
  variables: string[];
  isSystem: boolean;
}

export interface TrackingLinkDto {
  id: string;
  eventId: string;
  code: string;
  source: string | null;
  medium: string | null;
  campaignName: string | null;
  targetUrl: string;
  clickCount: number;
}
