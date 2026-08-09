import type { APIRoute } from 'astro';
import { checkHealth } from '../../lib/health';

export const prerender = false;

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(checkHealth()), {
    headers: { 'content-type': 'application/json' },
  });
};
