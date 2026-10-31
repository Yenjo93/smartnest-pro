import { bindings, defineConfig } from "cf/config";

export default defineConfig({
  worker: {
    name: "smartnest-licenses",
    entrypoint: "./worker.mjs",
    compatibilityDate: "2026-10-31",
    workersDev: false,
    domains: [{ hostname: "licenses.smartnest.pro", production: true, previews: false }],
    env: {
      DB: bindings.d1({ name: "smartnest-licenses", id: "01e1349c-67b7-4643-886b-aefed006a108" }),
      SMARTNEST_ADMIN_TOKEN: bindings.secret(),
      SMARTNEST_PANEL_PASSWORD: bindings.secret(),
      RATE_LIMITER: bindings.rateLimit({ namespace: "1001", simple: { limit: 60, period: 60 } }),
    },
    observability: {
      enabled: true,
      redactQueryString: true,
      logs: { enabled: true, invocationLogs: false },
      traces: { enabled: true, headSamplingRate: 0.1 },
    },
  },
});
