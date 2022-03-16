import { prisma } from './prisma'

async function main() {
  // create a user
  const user = await prisma.user.create({
    data: {
      email: `a@a.de${Math.random().toString(12)}`,
      name: 'Bob',
      ssn: '12345',
    },
  })
  console.log(user)

  // get last 3 users
  const users = await prisma.user.findMany({ take: -3 })
  console.log(users)
}

main()
