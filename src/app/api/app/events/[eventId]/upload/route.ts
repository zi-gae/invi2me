import { NextResponse } from 'next/server';
import { requireUser } from '@/shared/server/supabase';
import { requireEventPermission } from '@/features/auth/utils/rbac';
import { createSupabaseAdminClient } from '@/shared/server/supabase-admin';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const BUCKET = 'event-assets';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params;

  // 인증 + 권한 체크
  await requireUser();
  await requireEventPermission(eventId, 'event.edit');

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: '파일이 전송되지 않았습니다.' },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: '허용되지 않는 파일 형식입니다. (JPEG, PNG, WebP, GIF만 가능)' },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: '파일 크기가 10MB를 초과합니다.' },
      { status: 400 },
    );
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = `${crypto.randomUUID()}.${ext}`;
  const storagePath = `${eventId}/${safeName}`;

  const supabase = createSupabaseAdminClient();

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 },
    );
  }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return NextResponse.json({ url: urlData.publicUrl });
}
