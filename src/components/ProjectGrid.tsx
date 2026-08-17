import {
  ArrowUpRight,
  Layers,
  Wallet,
  StickyNote,
  ShoppingBag,
  Globe,
  Sparkles,
} from "lucide-react";

const projects = [
  {
    title: "Money Tracker",
    summary:
      "Full-stack personal finance app with real-time dashboards, calendar views, and MySQL-backed transaction management.",
    tags: ["Next.js", "MySQL", "Tailwind"],
    link: "/tracker",
    icon: Wallet,
  },
  {
    title: "E-Commerce Store",
    summary:
      "Full-stack storefront with product catalog, shopping cart, cash on delivery checkout, and admin order management.",
    tags: ["Next.js", "MySQL", "Tailwind"],
    link: "/shop",
    icon: ShoppingBag,
  },
  {
    title: "Notes",
    summary:
      "Minimal cloud-synced note-taking app with color-coded cards, pinning, search, and MongoDB Atlas backend.",
    tags: ["Next.js", "MongoDB", "Tailwind"],
    link: "/notes",
    icon: StickyNote,
  },
  {
    title: "Atlas Maps",
    summary:
      "Interactive geospatial visualization platform for urban planning data and demographic analysis.",
    tags: ["Mapbox", "D3.js", "Go"],
    link: "#",
    icon: Globe,
  },
  {
    title: "Prism CMS",
    summary:
      "Headless content management system with a visual editor, API-first architecture, and plugin ecosystem.",
    tags: ["Next.js", "GraphQL", "MongoDB"],
    link: "#",
    icon: Layers,
  },
  {
    title: "Echo — AI Writing",
    summary:
      "AI-powered writing assistant with context-aware suggestions, tone analysis, and collaborative editing.",
    tags: ["OpenAI", "TypeScript", "Redis"],
    link: "#",
    icon: Sparkles,
  },
];

export default function ProjectGrid() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Section header */}
      <div className="mb-12">
        <span className="text-xs font-medium uppercase tracking-widest text-[#86868b]">
          Selected Work
        </span>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#1d1d1f] sm:text-4xl">
          Projects
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <a
              key={project.title}
              href={project.link}
              className="group relative flex flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-zinc-300/80"
            >
              {/* Top-right icon */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-[#86868b] transition-colors duration-300 group-hover:bg-zinc-200/80 group-hover:text-[#1d1d1f]">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <ArrowUpRight
                  size={16}
                  className="mt-1 text-[#86868b] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold tracking-tight text-[#1d1d1f]">
                {project.title}
              </h3>

              {/* Summary */}
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[#86868b]">
                {project.summary}
              </p>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-100 px-2.5 py-1 text-[11px] font-medium text-[#86868b] transition-colors duration-300 group-hover:bg-zinc-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Hover link text */}
              <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-[#86868b] transition-colors duration-300 group-hover:text-[#1d1d1f]">
                View Project
                <ArrowUpRight
                  size={12}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
