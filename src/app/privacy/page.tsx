import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: '개인정보처리방침 — invi2me',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            invi2me
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="mb-2 text-2xl font-bold">개인정보처리방침</h1>
          <p className="mb-10 text-sm text-muted-foreground">최종 업데이트: 2025년 1월 1일</p>

          <div className="space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="mb-3 text-base font-semibold">1. 수집하는 개인정보 항목</h2>
              <p className="mb-3 text-muted-foreground">
                invi2me는 서비스 제공을 위해 아래 최소한의 개인정보를 수집합니다.
              </p>
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">구분</th>
                      <th className="px-4 py-2 text-left font-medium">수집 항목</th>
                      <th className="px-4 py-2 text-left font-medium">수집 목적</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">회원가입</td>
                      <td className="px-4 py-3 text-muted-foreground">이메일, 비밀번호</td>
                      <td className="px-4 py-3 text-muted-foreground">계정 생성 및 인증</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">이벤트 운영</td>
                      <td className="px-4 py-3 text-muted-foreground">게스트 이름, 연락처</td>
                      <td className="px-4 py-3 text-muted-foreground">초대 발송 및 RSVP 관리</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">결제</td>
                      <td className="px-4 py-3 text-muted-foreground">결제 수단 정보</td>
                      <td className="px-4 py-3 text-muted-foreground">유료 플랜 구독 처리</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">2. 개인정보 수집 및 이용 목적</h2>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>서비스 제공, 유지, 개선</li>
                <li>회원 인증 및 계정 관리</li>
                <li>이벤트 초대·RSVP·체크인 기능 제공</li>
                <li>고객 지원 및 공지사항 발송</li>
                <li>서비스 이용 통계 분석 (익명화 처리)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">3. 개인정보 보유 및 이용 기간</h2>
              <p className="text-muted-foreground">
                원칙적으로 개인정보 수집·이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 다만,
                관련 법령에 따라 아래 정보는 일정 기간 보관됩니다.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
                <li>계약·청약철회 기록: 5년 (전자상거래법)</li>
                <li>대금 결제·재화 공급 기록: 5년 (전자상거래법)</li>
                <li>소비자 불만·분쟁 처리 기록: 3년 (전자상거래법)</li>
                <li>접속 로그·접속 IP 정보: 3개월 (통신비밀보호법)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">4. 개인정보 제3자 제공</h2>
              <p className="text-muted-foreground">
                회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 이용자의 동의가
                있거나 법령에 근거가 있는 경우는 예외입니다. 서비스 운영을 위한 외부 위탁 업체(이메일 발송,
                결제, 클라우드 인프라 등)는 필요한 최소한의 정보만 제공받으며, 계약을 통해 관리됩니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">5. 쿠키 및 트래킹 기술</h2>
              <p className="text-muted-foreground">
                서비스는 이용 편의를 위해 쿠키를 사용합니다. 브라우저 설정을 통해 쿠키 수신을 거부할 수
                있으나, 일부 서비스 기능이 제한될 수 있습니다. 서비스 개선을 위해 PostHog를 통한 익명
                사용 분석 및 Sentry를 통한 오류 수집을 사용합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">6. 이용자의 권리</h2>
              <p className="mb-3 text-muted-foreground">이용자는 언제든지 아래 권리를 행사할 수 있습니다.</p>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>개인정보 열람 요청</li>
                <li>개인정보 정정·삭제 요청</li>
                <li>개인정보 처리 정지 요청</li>
                <li>계정 탈퇴 및 데이터 삭제 요청</li>
              </ul>
              <p className="mt-3 text-muted-foreground">
                권리 행사는{' '}
                <a href="mailto:privacy@invi2me.com" className="underline underline-offset-2 hover:text-foreground">
                  privacy@invi2me.com
                </a>
                으로 요청하시면 10 영업일 이내에 처리됩니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">7. 개인정보 보호책임자</h2>
              <div className="rounded-lg bg-muted p-5 text-muted-foreground">
                <p>
                  <strong className="text-foreground">개인정보 보호책임자</strong>: invi2me 운영팀
                </p>
                <p className="mt-1">
                  이메일:{' '}
                  <a href="mailto:privacy@invi2me.com" className="underline underline-offset-2 hover:text-foreground">
                    privacy@invi2me.com
                  </a>
                </p>
              </div>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">8. 방침 변경 공지</h2>
              <p className="text-muted-foreground">
                개인정보처리방침이 변경될 경우 시행 7일 전에 서비스 공지사항 또는 이메일을 통해 안내합니다.
                중요한 변경의 경우 30일 전에 공지합니다.
              </p>
            </section>

            <div className="rounded-lg border p-5 text-xs text-muted-foreground">
              이 방침은{' '}
              <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
                이용약관
              </Link>
              과 함께 읽어 주세요.
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
