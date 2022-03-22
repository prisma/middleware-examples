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
