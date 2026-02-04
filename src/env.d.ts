/// <reference types="astro/client" />

interface CloudflareRuntimeEnv {
  bagabondo_db: D1Database;
  // TODO: deprecate vagabond_db in favor of bagabondo_db
  vagabond_db: D1Database;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: CloudflareRuntimeEnv;
    };
  }
}
