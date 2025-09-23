import Joi from 'joi';
import { IEnv, TConfigFunction } from './config.types';
import 'dotenv/config';

const schema = Joi.object<IEnv>({
  API_KEY: Joi.string().required(),
}).unknown(true);

export default schema
  .validateAsync(process.env)
  .then(({ API_KEY }) => {
    return (() => ({
      API_KEY,
    })) satisfies TConfigFunction;
  })
  .catch((e: Joi.ValidationError) => {
    throw new Error(e.message);
  });
