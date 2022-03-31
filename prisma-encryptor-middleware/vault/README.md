# Prisma + Hashicorp Vault = ❤️

## How it works

This middleware uses an [AST /// comment](https://www.prisma.io/docs/concepts/components/prisma-schema#comments) to identify fields in the schema which should be encrypted.

```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  ///{"encryptor": "vault"}
  ssn   String?
  posts Post[]
}
```

When calling the middleware from the application, pass the Vault configuration information and the Prisma object generated in `@prisma/client`. Finally, activate the middleware with Prisma.use$

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from '@prisma-solutions-engineering/prisma-encryptor-middleware';

config()

export const prisma = new PrismaClient()
const encryptorConfig = {
    vault: {
        token: process.env.VAULT_TOKEN,
        path: 'transit',
        key: 'test-key',
        apiVersion: 'v1',
        endpoint: 'http://127.0.0.1:8200'
    }
};
const encryptor = PrismaEncryptorMiddleware(Prisma, encryptorConfig);

prisma.$use(
    encryptor
)
```

This middleware supports the following [model queries](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#model-queries):

1. [`create`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#create)
2. [`update`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#update)
3. [`findMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany)
4. [`findUnique`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique) 
5. [`findFirst`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirst)
6. [`delete`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#delete)
7. [`deleteMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#deleteMany)

All other model queries continue to work as expected but will not encrypt or decrypt fields using this middleware.

## Using this Demo

### Installation

1. Set a new private registry for the `@prisma-solutions-engineering` scope. For example, add a `.npmrc` file with the following. Replacing `YOUR_AUTH_TOKEN` with the token provided.

```
@prisma-solutions-engineering:registry=https://api.keygen.sh/v1/accounts/f3a113f7-0976-4fa7-9c9a-be7e17ca149f/artifacts/
//api.keygen.sh/v1/accounts/f3a113f7-0976-4fa7-9c9a-be7e17ca149f/artifacts/:_authToken=YOUR_AUTH_TOKEN
```
2. Install using your package manager of choice.

```bash
yarn install
```

```bash
npm install
```

3. Start the docker container with the Hashicorp Vault demo.

```bash
docker-compose up -d
```

4. Initialize the database and Vault credentials using the npm scripts found in `package.json`.

```bash
yarn init-database
yarn init-vault
```

```bash
npm run init-database
npm run init-vault
```

### Run the demo

```bash
yarn start # starts the script at src/main.ts
```

```bash
npm run start # starts the script at src/main.ts
```

See `src/prisma.ts` for configuration and instantiation of the field encryptor.

### Validate the encryption

This demo uses a SQLite database found in `prisma/dev.db`. Navigate to the database using the tool of your choice and validate that the fields (`ssn` in this demo) in the database are encrypted and requests using the Prisma model queries return decrypted values.

## Known Limitations

- This middleware does not currently support [nested reads or writes](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries). 
- This middleware does not currently support the [`createMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createmany) or [`updateMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#updatemany) model queries.

## FAQ

### How do I get access to the prisma-encryptor-middleware?

This middleware is available as a private package for Enterprise customers. [Reach out to us](https://www.prisma.io/prisma-enterprise) to discuss.


### Which encryption methods are supported?

AWS KMS and Hashicorp Vault are currently supported. More encryption methods may be supported based on demand.

### Can I use both encryption methods?

Yes. Pass both the KMS and Vault configuration objects when instantiating the middleware:

```ts
const encryptorConfig = {
  kms: {
    key: '',
  },
  vault: {
    token: '',
    path: '',
    key: '',
    apiVersion: '',
    endpoint: '',
  },
}
```

and decorate your schema with the encryption methods as desired:

```prisma
...
model User {
  ///{ "encryptor": "kms"}
  ssn   String?
  ///{ "encryptor": "vault"}
  card  String?
}
...
```