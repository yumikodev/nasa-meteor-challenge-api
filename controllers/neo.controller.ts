import { HTTPException } from '@hono/hono/http-exception';
import { NeoFeed } from '../interfaces/neo.interfaces.ts';

export class NeoController {
  #apiUrl = 'https://api.nasa.gov/neo/rest/v1';

  static instance: NeoController;

  static geInstance() {
    if (!this.instance) {
      this.instance = new NeoController();
    }
    return this.instance;
  }

  async getFeed(): Promise<NeoFeed> {
    const res = await fetch(this.getAPIUrl('feed'));
    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      throw new HTTPException(400, {
        message: data.message || 'Unknown error',
      });
    }
    return data;
  }

  getAPIUrl(endpoint: string) {
    const api_key = Deno.env.get('API_KEY')!;
    const searchParams = new URLSearchParams({
      api_key,
    });

    return `${this.#apiUrl}/${endpoint}?${searchParams.toString()}`;
  }
}
