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
    encryptor.middleware
)
