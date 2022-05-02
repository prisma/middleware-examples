import { Prisma, PrismaClient } from '@prisma/client'
import PrismaReadReplicaMiddleware from 'prisma-read-replica-middleware';

const modelsToExclude = ['User'];

export const prisma = new PrismaClient()

prisma.$use(PrismaReadReplicaMiddleware(modelsToExclude));