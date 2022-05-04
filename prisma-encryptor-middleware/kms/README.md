# Prisma + AWS KMS = ❤️

## How it works

This middleware uses an [AST /// comment](https://www.prisma.io/docs/concepts/components/prisma-schema#comments) to identify fields in the schema which should be encrypted.

```
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  ///{"encryptor": "kms"}
  ssn   String?
  posts Post[]
}
```

When calling the middleware from the application, [load credentials by your application](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html), pass the KMS configuration information and the Prisma object generated in `@prisma/client`. Finally, activate the middleware with Prisma.use$

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from '@prisma-solutions-engineering/prisma-encryptor-middleware';

config()

export const prisma = new PrismaClient()
const encryptorConfig = {
    kms: {
        key: ''
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
8. [`upsert`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert)
9. [`createMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#createMany)
10. [`updateMany`](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#updateMany)

All other model queries continue to work as expected but will not encrypt or decrypt fields using this middleware.

## Using this Demo

### KMS Configuration

1. [You cannot use an asymmetric KMS key to encrypt data keys.](https://docs.aws.amazon.com/kms/latest/APIReference/API_GenerateDataKey.html). When creating a key for encryption choose "Symmetric" and "Encrypt and Decrypt".
2. When choosing [regionality of the key](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html) consider your business requirements and security mandate. [Multi-region keys open new security concerns](https://docs.aws.amazon.com/kms/latest/developerguide/multi-region-keys-overview.html#mrk-when-to-use) and require more complex permissions configuration. 

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

3. Initialize the database using the npm scripts found in `package.json`.

```bash
yarn init-database
```

```bash
npm run init-database
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

This demo uses an SQLite database found in `prisma/dev.db`. Navigate to the database using the tool of your choice and validate that the fields (`ssn` in this demo) in the database are encrypted, and requests using the Prisma model queries return decrypted values.

## Known Limitations

- Raw queries (such as those made with `prisma.$queryRaw`) are not encrypted or decrypted.
- Encrypted fields can not be queried using `where` with the decrypted value.

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