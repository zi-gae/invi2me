// Billing DTOs

export interface OrderDto {
  id: string;
  workspaceId: string;
  eventId: string | null;
  orderType: string;
  status: string;
  currency: string;
  amountTotal: number;
  provider: string;
  providerOrderId: string | null;
  createdAt: string;
}

export interface SubscriptionDto {
  planCode: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  eventLimit: number;
  eventsUsed: number;
  seatLimit: number;
  seatsUsed: number;
}

export interface BillingSummaryDto {
  currentPlan: string;
  totalSpent: number;
  activeSubscription: SubscriptionDto | null;
  recentOrders: OrderDto[];
}
