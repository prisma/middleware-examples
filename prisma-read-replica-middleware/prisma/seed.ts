import { PrismaClient } from '@prisma/client'
import { PrismaClient as RRPrismaClient } from 'prisma-read-replica-middleware/prisma/read-replica-client/index.js'
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient()
const rrPRisma = new RRPrismaClient()

async function main() {
  const userEmail = faker.internet.email();

  const user = {
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: faker.name.firstName(),
      posts: {
        create: [
          {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            published: true
          },
          {
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraph(),
            published: true
          }
        ]
      },
    },
  };

  await prisma.user.upsert(user);

  const readReplicaUser = {
    ...user,
    create: {
      ...user.create,
      posts: {
        ...user.create.posts,
        create: user.create.posts.create.map(post => {
          return {
            ...post,
            title: "Found in Read Replica" +  post.title
          }
        })
      }
    }
  }
  await rrPRisma.user.upsert(readReplicaUser);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })