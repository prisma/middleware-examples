import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from 'prisma-encryptor-middleware';

config()

export const prisma = new PrismaClient()
const encryptorConfig = {
    config: {
        kms: {
            access_key: '',
            secret: '',
            key: ''
        }
    }
};
const encryptor = PrismaEncryptorMiddleware(Prisma.dmmf, encryptorConfig);

prisma.$use(
    encryptor.middleware
)
