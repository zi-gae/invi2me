import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Mail,
  CheckSquare,
  Users,
  BarChart2,
  ArrowRight,
} from "lucide-react";

const FLOW_STEPS = [
  {
    icon: Mail,
    title: "초대",
    description: "개인화된 초대 페이지를 만들고 게스트에게 링크를 전송하세요",
  },
  {
    icon: CheckSquare,
    title: "RSVP",
    description: "게스트가 모바일에서 바로 참석 여부를 응답합니다",
  },
  {
    icon: Users,
    title: "게스트 운영",
    description: "응답 현황, 그룹, 좌석을 한 곳에서 관리하세요",
  },
  {
    icon: BarChart2,
    title: "리포트",
    description: "체크인 현황과 전체 행사 통계를 실시간으로 확인합니다",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <span className="text-lg font-semibold tracking-tight">invi2me</span>
          <Button render={<Link href="/login" />} size="sm">
            로그인
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-sm font-medium text-muted-foreground">
            Event Operating System
          </p>
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            초대부터 현장까지,
            <br />
            하나로
          </h1>
          <p className="mb-10 text-lg text-muted-foreground">
            청첩장을 넘어, 게스트 응답부터 체크인·리포트까지{" "}
            <br className="hidden sm:block" />
            이벤트 운영 전 과정을 하나의 플랫폼으로 연결합니다.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button render={<Link href="/login" />} size="lg">
              무료로 시작하기
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button render={<Link href="/login" />} variant="outline" size="lg">
              로그인
            </Button>
          </div>
        </div>

        {/* Flow Steps */}
        <div className="mx-auto mt-24 w-full max-w-4xl">
          <p className="mb-8 text-center text-sm font-medium text-muted-foreground">
            초대 → 응답 → 운영 → 리포트, 네 단계로 완성되는 이벤트
          </p>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FLOW_STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="flex flex-col items-center rounded-xl border bg-card p-6 text-center"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-muted">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">
                    {index + 1}단계
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <p className="text-center text-xs text-muted-foreground">
          © 2025 invi2me. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
