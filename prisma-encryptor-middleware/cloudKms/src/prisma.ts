import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { PrismaEncryptorMiddleware } from '@prisma-solutions-engineering/prisma-encryptor-middleware/src';

config()

export const prisma = new PrismaClient()

const encryptorConfig = {
    cloudKms: {
        projectId: process.env.PROJECT_ID,
        locationId: process.env.LOCATION_ID,
        keyRingId: process.env.KEYRING_ID,
        keyId: process.env.KEY_ID
    }
};

const encryptor = PrismaEncryptorMiddleware(Prisma, encryptorConfig);

prisma.$use(
    encryptor
)
