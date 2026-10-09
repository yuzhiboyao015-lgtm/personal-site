import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Work } from "@/components/work";
import { Writing } from "@/components/writing";
import { About } from "@/components/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} · ${site.role}`,
  description: site.bio[0],
};

export default function HomePage() {
  return (
    <div id="top">
      <Hero />
      <Work />
      <Writing limit={3} />
      <About />
    </div>
  );
}
