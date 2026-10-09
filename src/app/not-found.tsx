import Link from "next/link";
import { Icon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page grid min-h-[70vh] place-items-center pt-32">
      <div className="text-center">
        <p
          className="text-gradient text-7xl font-semibold tracking-tight sm:text-9xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          404
        </p>
        <h1 className="mt-6 text-xl font-medium">这里什么都没有</h1>
        <p className="mt-3 text-sm text-[var(--fg-muted)]">
          链接可能过期了，也可能是我手滑写错了。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-primary">
            回首页
            <Icon name="arrow" />
          </Link>
          <Link href="/lab" className="btn-ghost">
            去实验室
          </Link>
        </div>
      </div>
    </div>
  );
}
