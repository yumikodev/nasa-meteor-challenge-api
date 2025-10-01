import { Hono } from '@hono/hono';
import { cors } from '@hono/hono/cors';
import { logger } from '@hono/hono/logger';
import { neoRouter } from './routes/neo.routes.ts';
import '@std/dotenv/load';

const app = new Hono();
app.use(logger());
app.use(cors());

app.get('/', (c) => {
  const obj = {
    message: 'NEO API WRAPPER',
    team: 'CAPINAUTRAS',
    versions: Deno.version,
    status: 200,
  };

  return c.json(obj);
});
app.route('/', neoRouter);

if (import.meta.main) {
  Deno.serve(app.fetch);
}
