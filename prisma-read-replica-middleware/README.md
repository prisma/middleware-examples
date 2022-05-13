# Prisma Read Replica Middleware Example

## Caveats

We have provided this middleware as an example only, and without warranty. It is not intended for use in a production environment. Please consider the limitations documented below before adding it to your application.

## How it works

This middleware example works by creating a "shadow client" and redirecting specific requests to that client behind the scenes.

When calling the middleware from the application, configure any models that you want the read replica to ignore, and activate the middleware with Prisma.use$

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaReadReplicaMiddleware } from 'prisma-read-replica-middleware';

export const prisma = new PrismaClient()

const modelsToExclude = ['User'];

prisma.$use(PrismaReadReplicaMiddleware(modelsToExclude));
```

This middleware supports the following [model queries](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries):

1. [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany)
2. [`findUnique`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique) 
3. [`findFirst`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst)

All other model queries continue to work as expected but will not encrypt or decrypt fields using this middleware.

## Using this Demo

### Set up

1. Install dependencies
2. `npm run init-database`
3. `npm run start` -- Observe that `Posts` are returned from the Read Replica (titles prefixed) while `Users` are not

## Limitations

1. This middleware does not perform migrations against a read replica database.
2. This middleware only intercepts the following actions: find, findMany, findUnique
3. This middleware does not account for custom providers.
4. This middleware does not account for nested reads because middleware does not have access to the underlying SQL query. In the following example the request will _not_ be sent to the Read Replica because `User` is an excluded model.

```
import { Prisma, PrismaClient } from '@prisma/client'
import PrismaReadReplicaMiddleware from 'prisma-read-replica';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const modelsToExclude = ['User'];

prisma.$use(PrismaReadReplicaMiddleware(modelsToExclude));

const getUsers = await prisma.user.findMany({
  where: {
    email: {
      contains: 'test',
    },
  },
  include: {
    post: true,
  },
})
```
