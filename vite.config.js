import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, "");
  const webhook = env.VITE_LEADS_WEBHOOK_URL || "";

  let proxy = {};
  if (webhook) {
    try {
      const u = new URL(webhook);
      proxy["/api/leads-gas"] = {
        target: `${u.protocol}//${u.host}`,
        changeOrigin: true,
        secure: true,
        rewrite: () => `${u.pathname}${u.search}`,
      };
    } catch {
      // ignore invalid VITE_LEADS_WEBHOOK_URL
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy },
  };
});
