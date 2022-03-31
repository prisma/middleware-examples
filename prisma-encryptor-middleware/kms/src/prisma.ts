import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from '@prisma-solutions-engineering/prisma-encryptor-middleware/src/index';

config()

export const prisma = new PrismaClient()

const encryptorConfig = {
    kms: {
        key: process.env.KEY
    }
};

const encryptor = PrismaEncryptorMiddleware(Prisma, encryptorConfig);

prisma.$use(
    encryptor
)
