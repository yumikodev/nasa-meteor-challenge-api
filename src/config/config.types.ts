import { ConfigFactory } from '@nestjs/config';

export interface IEnv {
  API_KEY: string;
}

export type TConfigFunction = ConfigFactory<IEnv>;
