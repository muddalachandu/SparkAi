export function getBYOXLinkForTask(text: string): { query: string; label: string } | null {
  if (!text) return null;
  const t = text.toLowerCase();
  
  if (t.includes("redis") || t.includes("key-value") || t.includes("kv store")) {
    return { query: "redis", label: "Build Redis" };
  }
  if (t.includes("sqlite") || t.includes("b-tree") || (t.includes("database") && !t.includes("redis"))) {
    return { query: "sqlite", label: "Build Database" };
  }
  if (t.includes("git ") || t.includes("version control") || t.includes(" git")) {
    return { query: "git", label: "Build Git" };
  }
  if (t.includes("dns ") || t.includes("dns server") || t.includes("recursive lookup")) {
    return { query: "dns", label: "Build DNS" };
  }
  if (t.includes("docker") || t.includes("container") || t.includes("namespaces")) {
    return { query: "docker", label: "Build Docker" };
  }
  if (t.includes("compiler") || t.includes("interpreter") || t.includes("parser") || t.includes("programming language")) {
    return { query: "programming-language", label: "Build Compiler" };
  }
  if (t.includes("shell") || t.includes("bash") || t.includes("cli prompt")) {
    return { query: "shell", label: "Build Shell" };
  }
  if (t.includes("web server") || t.includes("http server")) {
    return { query: "web-server", label: "Build Web Server" };
  }
  if (t.includes("torrent") || t.includes("bittorrent")) {
    return { query: "bittorrent", label: "Build BitTorrent" };
  }
  if (t.includes("blockchain") || t.includes("cryptocurrency")) {
    return { query: "blockchain", label: "Build Blockchain" };
  }
  if (t.includes("3d renderer") || t.includes("ray tracing") || t.includes("graphics engine")) {
    return { query: "3d-renderer", label: "Build 3D Renderer" };
  }
  if (t.includes("bot") || t.includes("chatbot") || t.includes("discord bot") || t.includes("slack bot")) {
    return { query: "bot", label: "Build Bot" };
  }
  if (t.includes("operating system") || t.includes("kernel") || t.includes("bootloader")) {
    return { query: "operating-system", label: "Build OS" };
  }
  if (t.includes("text editor")) {
    return { query: "text-editor", label: "Build Text Editor" };
  }
  if (t.includes("regex engine")) {
    return { query: "regex-engine", label: "Build Regex Engine" };
  }
  return null;
}
