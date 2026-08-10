import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="about"
      className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-40 md:pb-24"
    >
      {/* Badge */}
      <div className="animate-fade-in-up">
        <span className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white px-4 py-1.5 text-xs font-medium tracking-wide text-[#86868b] shadow-sm">
          Full-Stack Engineer &amp; Designer
        </span>
      </div>

      {/* Headline */}
      <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-[#1d1d1f] sm:text-5xl lg:text-6xl lg:leading-[1.1] animate-fade-in-up-delay-1">
        Crafting digital experiences that feel{" "}
        <span className="bg-gradient-to-r from-[#1d1d1f] via-[#555] to-[#86868b] bg-clip-text text-transparent">
          effortless.
        </span>
      </h1>

      {/* Intro text */}
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#86868b] md:text-xl animate-fade-in-up-delay-2">
        I design and build polished, performant web applications with a focus on
        clean architecture and thoughtful interfaces. Currently exploring the
        intersection of AI and modern frontend engineering.
      </p>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap items-center gap-4 animate-fade-in-up-delay-3">
        <a
          href="#projects"
          className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-[#333] hover:shadow-md"
        >
          View Projects
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </a>
        <a
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-medium text-[#1d1d1f] shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md"
        >
          Get in Touch
        </a>
      </div>
    </section>
  );
}
