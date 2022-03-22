# Prisma + AWS KMS = ❤️

## Usage

### 1. Set everything up

```bash
yarn install
yarn init-database
```

### 2. Add environment variables

```bash
export AWS_SECRET_ACCESS_KEY=<your secret access key>
export AWS_ACCESS_KEY_ID=<your access key id>
export KEY=<arn to aws kms key>
```

### 3. Run the code

```bash
yarn start # starts the script at src/main.ts
```

See `src/prisma.ts` for configuration and instantiation of the field encryptor.
