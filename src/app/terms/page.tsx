import Link from 'next/link';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: '이용약관 — invi2me',
};

export default function TermsPage() {
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
          <h1 className="mb-2 text-2xl font-bold">이용약관</h1>
          <p className="mb-10 text-sm text-muted-foreground">최종 업데이트: 2025년 1월 1일</p>

          <div className="space-y-10 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="mb-3 text-base font-semibold">제1조 (목적)</h2>
              <p className="text-muted-foreground">
                이 약관은 invi2me(이하 "회사")가 제공하는 이벤트 운영 플랫폼 서비스(이하 "서비스")의 이용 조건 및
                절차, 회사와 이용자 간의 권리·의무·책임 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제2조 (정의)</h2>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                  <strong className="text-foreground">서비스</strong>: 회사가 제공하는 이벤트 초대·RSVP·체크인·리포트 등
                  일체의 온라인 플랫폼 서비스
                </li>
                <li>
                  <strong className="text-foreground">이용자</strong>: 이 약관에 동의하고 서비스를 이용하는 개인 또는
                  법인
                </li>
                <li>
                  <strong className="text-foreground">게스트</strong>: 이용자가 이벤트에 초대한 제3자
                </li>
                <li>
                  <strong className="text-foreground">이벤트</strong>: 이용자가 서비스를 통해 생성·운영하는 결혼식,
                  기업 행사 등 일체의 행사
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제3조 (약관의 효력 및 변경)</h2>
              <p className="text-muted-foreground">
                이 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.
                회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 최소 7일 전에
                공지합니다. 중요한 변경의 경우 30일 전에 공지합니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제4조 (서비스 이용)</h2>
              <p className="mb-3 text-muted-foreground">
                서비스는 만 14세 이상인 자가 이용할 수 있습니다. 이용자는 다음 행위를 하여서는 안 됩니다.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>타인의 개인정보를 무단으로 수집·사용하는 행위</li>
                <li>서비스를 통해 불법적인 정보를 배포하는 행위</li>
                <li>서비스의 정상적인 운영을 방해하는 행위</li>
                <li>회사의 사전 동의 없이 서비스를 상업적으로 이용하는 행위</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제5조 (개인정보 보호)</h2>
              <p className="text-muted-foreground">
                회사는 관련 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위해 노력합니다. 개인정보의
                보호 및 사용에 관해서는{' '}
                <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                  개인정보처리방침
                </Link>
                을 참고해 주세요.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제6조 (서비스 변경 및 중단)</h2>
              <p className="text-muted-foreground">
                회사는 서비스의 내용을 변경하거나 중단할 수 있습니다. 서비스 변경·중단으로 인해 이용자가
                입은 손해에 대해 회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제7조 (책임의 한계)</h2>
              <p className="text-muted-foreground">
                회사는 천재지변, 불가항력, 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지
                않습니다. 회사의 손해배상 책임은 관련 법령이 허용하는 최대 범위 내에서 서비스 이용 요금을
                초과하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-base font-semibold">제8조 (준거법 및 관할)</h2>
              <p className="text-muted-foreground">
                이 약관은 대한민국 법률에 따라 해석되며, 서비스 이용과 관련한 분쟁은 대한민국 법원을
                관할 법원으로 합니다.
              </p>
            </section>

            <section className="rounded-lg bg-muted p-5">
              <h2 className="mb-2 text-base font-semibold">문의</h2>
              <p className="text-muted-foreground">
                약관에 관한 문의사항은{' '}
                <a href="mailto:hello@invi2me.com" className="underline underline-offset-2 hover:text-foreground">
                  hello@invi2me.com
                </a>
                으로 연락해 주세요.
              </p>
            </section>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
