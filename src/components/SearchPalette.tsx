import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { DOMAINS } from "@/lib/domains";
import { SEED_ROADMAPS } from "@/lib/roadmap-catalog";
import * as Icons from "lucide-react";

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Toggle the menu when pressing ⌘K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  // Search results calculation
  const searchLower = search.toLowerCase();

  // Match domains
  const matchedDomains = DOMAINS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchLower) ||
      d.category.toLowerCase().includes(searchLower) ||
      d.blurb.toLowerCase().includes(searchLower) ||
      d.tags.some((t) => t.toLowerCase().includes(searchLower)),
  ).slice(0, 5);

  // Match nodes from seeded roadmaps
  const matchedNodes: Array<{
    domainSlug: string;
    domainName: string;
    nodeId: string;
    nodeTitle: string;
    why: string;
  }> = [];

  if (searchLower.length >= 2) {
    Object.entries(SEED_ROADMAPS).forEach(([slug, tiers]) => {
      const domainName = DOMAINS.find((d) => d.slug === slug)?.name ?? slug;
      Object.entries(tiers).forEach(([tier, data]) => {
        data.nodes.forEach((node) => {
          if (
            node.title.toLowerCase().includes(searchLower) ||
            node.why.toLowerCase().includes(searchLower)
          ) {
            // Avoid duplicates
            if (!matchedNodes.some((n) => n.nodeId === node.id && n.domainSlug === slug)) {
              matchedNodes.push({
                domainSlug: slug,
                domainName,
                nodeId: node.id,
                nodeTitle: node.title,
                why: node.why,
              });
            }
          }
        });
      });
    });
  }

  const handleSelect = (
    to: string,
    params?: Record<string, string>,
    searchParams?: Record<string, string>,
  ) => {
    setOpen(false);
    setSearch("");
    navigate({ to, params, search: searchParams });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-card/95 shadow-glow backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Global Command Palette">
          <div className="flex items-center border-b border-white/5 px-4">
            <Icons.Search className="h-4 w-4 text-muted-foreground" />
            <Command.Input
              autoFocus
              placeholder="Type a domain, skill, or topic..."
              value={search}
              onValueChange={setSearch}
              className="flex h-12 w-full bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => setOpen(false)}
              className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              ESC
            </button>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2" data-lenis-prevent>
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {/* Quick Actions */}
            <Command.Group
              heading="Navigation"
              className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              <div className="mt-1.5 space-y-0.5">
                <Item
                  onSelect={() => handleSelect("/dashboard")}
                  icon={Icons.LayoutDashboard}
                  title="Dashboard"
                  desc="View learning progress and profile metrics"
                />
                <Item
                  onSelect={() => handleSelect("/roadmap")}
                  icon={Icons.Compass}
                  title="Roadmap Planner"
                  desc="Personalized and custom learning roadmaps"
                />
                <Item
                  onSelect={() => handleSelect("/resources")}
                  icon={Icons.Trophy}
                  title="Resources Hub"
                  desc="Explore catalog of all learning tracks"
                />
                <Item
                  onSelect={() => handleSelect("/mentor")}
                  icon={Icons.Brain}
                  title="AI Mentor"
                  desc="Interactive personalized lesson designer"
                />
              </div>
            </Command.Group>

            {/* Domains Catalog */}
            {matchedDomains.length > 0 && (
              <Command.Group
                heading="Learning Tracks"
                className="mt-4 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <div className="mt-1.5 space-y-0.5">
                  {matchedDomains.map((d) => {
                    const DynIcon =
                      (Icons as any)[d.icon] as React.ComponentType<{ className?: string }> || Icons.Code2;
                    return (
                      <Item
                        key={d.slug}
                        onSelect={() => handleSelect("/roadmap/$slug", { slug: d.slug })}
                        icon={DynIcon}
                        title={d.name}
                        desc={d.blurb}
                      />
                    );
                  })}
                </div>
              </Command.Group>
            )}

            {/* Roadmap Nodes */}
            {matchedNodes.length > 0 && (
              <Command.Group
                heading="Roadmap Topics & Skills"
                className="mt-4 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                <div className="mt-1.5 space-y-0.5">
                  {matchedNodes.slice(0, 4).map((node) => (
                    <Item
                      key={`${node.domainSlug}-${node.nodeId}`}
                      onSelect={() =>
                        handleSelect(
                          "/roadmap/$slug",
                          { slug: node.domainSlug },
                          { node: node.nodeId },
                        )
                      }
                      icon={Icons.Target}
                      title={node.nodeTitle}
                      desc={`${node.domainName} · ${node.why}`}
                    />
                  ))}
                </div>
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}

function Item({
  onSelect,
  icon: Icon,
  title,
  desc,
}: {
  onSelect: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-foreground outline-none transition duration-150 aria-selected:bg-white/5 hover:bg-white/5"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-spark">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-medium text-foreground leading-snug">{title}</div>
        <div className="truncate text-xs text-muted-foreground leading-normal">{desc}</div>
      </div>
    </Command.Item>
  );
}
