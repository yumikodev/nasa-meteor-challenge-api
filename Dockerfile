FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY . .

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
RUN pnpm build

FROM base
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD [ "sh", "-c", "pnpm start:prod" ]