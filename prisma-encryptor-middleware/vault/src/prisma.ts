import { Prisma, PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import Vault from 'node-vault'
import { PrismaEncryptorMiddleware } from 'prisma-encryptor-middleware';

const vault = Vault()

config()

export const prisma = new PrismaClient()
const encryptorConfig = {
    config: {
        vault: {
            token: env("VAULT_TOKEN"),
            path: 'transit',
            key: 'test-key'
        }
    }
};
const encryptor = PrismaEncryptorMiddleware(Prisma.dmmf, encryptorConfig);

prisma.$use(
    encryptor.middleware
)
