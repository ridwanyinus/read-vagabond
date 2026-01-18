/// <reference types="astro/client" />

type Runtime = import("@cloudflare/workers-types").KVNamespace &
  import("@cloudflare/workers-types").R2Bucket &
  import("@cloudflare/workers-types").D1Database;

declare namespace App {
  interface Locals {
    runtime: {
      env: {
        vagabond_db: D1Database;
      };
    };
  }
}

type D1Database = import("@cloudflare/workers-types").D1Database;
