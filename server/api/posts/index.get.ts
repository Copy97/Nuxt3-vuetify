import { PrismaClient } from "@prisma/client";

// Instantiate Prisma Client
const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // findMany with order by id descending limit 10
  const posts = await prisma.post.findMany({
    orderBy: {
      id: "desc",
    },
    take: 5,
  });

  return {
    statusCode: 200,
    body: posts,
  };
});
