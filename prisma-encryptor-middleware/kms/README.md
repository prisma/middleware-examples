# Prisma + AWS KMS = ❤️

## How it works

This middleware uses a [/// comment](https://www.prisma.io/docs/concepts/components/prisma-schema#comments) to identify fields in the schema which should be encrypted.

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
When calling the middleware from the application, pass in AWS KMS configuration information as well as the Prisma DMMF which will include the schema. Finally activate the middleware with Prisma.use$

```ts
import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from 'prisma-encryptor-middleware';

config()

export const prisma = new PrismaClient()
const encryptorConfig = {
    kms: {
        key: process.env.KEY
    }
};

const encryptor = PrismaEncryptorMiddleware(Prisma.dmmf, encryptorConfig);

prisma.$use(
    encryptor.middleware
)
```

## Using this Demo

### 1. Set everything up

```bash
yarn install
yarn init-database
```

### 2. Add environment variables

```bash
export AWS_SECRET_ACCESS_KEY=<your secret access key>
export AWS_ACCESS_KEY_ID=<your access key id>
export AWS_REGION=<your aws region>
export KEY=<arn to aws kms key>
```

### 3. Run the code

```bash
yarn start # starts the script at src/main.ts
```

See `src/prisma.ts` for configuration and instantiation of the field encryptor.

## FAQ
1) Q: How do I get access to the prisma-encryptor-middleware?
  A: The Encryptor Middleware is available as a private package for Enterprise customers. Reach out to us [here](https://www.prisma.io/prisma-enterprise) to discuss.
2) Q: Why is encrytor fields marked with /// comment instead of prisma schema markdown?
  A: This is a short-term work around to avoid more significant changes in the open source ORM. Overtime the configuration and identification of fields to be encrypted will be moved to native markdown.
