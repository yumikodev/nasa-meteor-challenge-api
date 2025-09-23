import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns';
import { NeoFeed } from './interfaces/neo.interfaces';

@Injectable()
export class NeoService {
  readonly apiUrl = 'https://api.nasa.gov/neo/rest/v1';

  constructor(private readonly config: ConfigService) {}

  async feed(): Promise<NeoFeed> {
    const res = await fetch(this.getAPIUrl('feed'));
    const data = await res.json();

    if (!res.ok) throw new BadRequestException(data);

    return data;
  }

  getAPIUrl(endpoint: string, start_date?: Date, end_date?: Date) {
    const api_key = this.config.getOrThrow<string>('API_KEY');
    const searchParams = new URLSearchParams({
      api_key,
    });

    if (start_date)
      searchParams.append('start_date', format(start_date, 'yyyy-MM-dd'));
    if (end_date)
      searchParams.append('end_date', format(end_date, 'yyyy-MM-dd'));

    return `${this.apiUrl}/${endpoint}?${searchParams.toString()}`;
  }
}
