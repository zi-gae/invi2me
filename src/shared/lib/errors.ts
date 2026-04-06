/**
 * Domain error classes
 *
 * Separation principle:
 * - `message`: safe to show to users (Korean, no sensitive data)
 * - `cause` / internal logging: sent to Sentry with full context
 */

export class DomainError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(
    message: string,
    options?: { code?: string; statusCode?: number; cause?: unknown }
  ) {
    super(message, { cause: options?.cause });
    this.name = 'DomainError';
    this.code = options?.code ?? 'DOMAIN_ERROR';
    this.statusCode = options?.statusCode ?? 500;
  }
}

// === Not Found ===

export class EventNotFoundError extends DomainError {
  constructor(identifier: string) {
    super('이벤트를 찾을 수 없습니다.', {
      code: 'EVENT_NOT_FOUND',
      statusCode: 404,
      cause: { identifier },
    });
    this.name = 'EventNotFoundError';
  }
}

export class GuestNotFoundError extends DomainError {
  constructor(identifier: string) {
    super('게스트를 찾을 수 없습니다.', {
      code: 'GUEST_NOT_FOUND',
      statusCode: 404,
      cause: { identifier },
    });
    this.name = 'GuestNotFoundError';
  }
}

export class WorkspaceNotFoundError extends DomainError {
  constructor(identifier: string) {
    super('워크스페이스를 찾을 수 없습니다.', {
      code: 'WORKSPACE_NOT_FOUND',
      statusCode: 404,
      cause: { identifier },
    });
    this.name = 'WorkspaceNotFoundError';
  }
}

export class OrganizationNotFoundError extends DomainError {
  constructor(identifier: string) {
    super('조직을 찾을 수 없습니다.', {
      code: 'ORGANIZATION_NOT_FOUND',
      statusCode: 404,
      cause: { identifier },
    });
    this.name = 'OrganizationNotFoundError';
  }
}

export class PageNotFoundError extends DomainError {
  constructor(identifier: string) {
    super('페이지를 찾을 수 없습니다.', {
      code: 'PAGE_NOT_FOUND',
      statusCode: 404,
      cause: { identifier },
    });
    this.name = 'PageNotFoundError';
  }
}

// === Auth / Permission ===

export class UnauthenticatedError extends DomainError {
  constructor() {
    super('로그인이 필요합니다.', {
      code: 'UNAUTHENTICATED',
      statusCode: 401,
    });
    this.name = 'UnauthenticatedError';
  }
}

export class InsufficientPermissionError extends DomainError {
  constructor(requiredPermission?: string) {
    super('이 작업을 수행할 권한이 없습니다.', {
      code: 'INSUFFICIENT_PERMISSION',
      statusCode: 403,
      cause: { requiredPermission },
    });
    this.name = 'InsufficientPermissionError';
  }
}

// === Business Logic ===

export class RsvpAlreadySubmittedError extends DomainError {
  constructor(guestId: string) {
    super('이미 응답을 제출하셨습니다.', {
      code: 'RSVP_ALREADY_SUBMITTED',
      statusCode: 409,
      cause: { guestId },
    });
    this.name = 'RsvpAlreadySubmittedError';
  }
}

export class RsvpClosedError extends DomainError {
  constructor(eventId: string) {
    super('RSVP 응답 기간이 종료되었습니다.', {
      code: 'RSVP_CLOSED',
      statusCode: 403,
      cause: { eventId },
    });
    this.name = 'RsvpClosedError';
  }
}

export class CheckinDuplicateError extends DomainError {
  constructor(guestId: string) {
    super('이미 체크인 처리되었습니다.', {
      code: 'CHECKIN_DUPLICATE',
      statusCode: 409,
      cause: { guestId },
    });
    this.name = 'CheckinDuplicateError';
  }
}

export class EventNotPublishedError extends DomainError {
  constructor(eventId: string) {
    super('이벤트가 공개되지 않았습니다.', {
      code: 'EVENT_NOT_PUBLISHED',
      statusCode: 403,
      cause: { eventId },
    });
    this.name = 'EventNotPublishedError';
  }
}

export class InvalidAccessCodeError extends DomainError {
  constructor() {
    super('유효하지 않은 접근 코드입니다.', {
      code: 'INVALID_ACCESS_CODE',
      statusCode: 401,
    });
    this.name = 'InvalidAccessCodeError';
  }
}

export class InvalidTokenError extends DomainError {
  constructor() {
    super('유효하지 않은 토큰입니다.', {
      code: 'INVALID_TOKEN',
      statusCode: 401,
    });
    this.name = 'InvalidTokenError';
  }
}

export class SlugAlreadyTakenError extends DomainError {
  constructor(slug: string) {
    super('이미 사용 중인 주소입니다.', {
      code: 'SLUG_ALREADY_TAKEN',
      statusCode: 409,
      cause: { slug },
    });
    this.name = 'SlugAlreadyTakenError';
  }
}

export class ValidationError extends DomainError {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(fieldErrors: Record<string, string[]>) {
    super('입력 데이터가 유효하지 않습니다.', {
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      cause: { fieldErrors },
    });
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}
