import { prisma } from './prisma'

async function main() {
  // Query posts -- Should hit the Read Replica
  const posts = await prisma.post.findMany({ take: -3 })
  console.log(posts)

  // Query users -- Should not hit the Read Replica as it's an excluded model in src/prisma.ts
  const users = await prisma.user.findMany({ take: -3 })
  console.log(users)
}

main()
