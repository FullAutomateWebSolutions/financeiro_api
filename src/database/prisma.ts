import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
// export const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'],
// });

const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    $allOperations: async ({ args, query }) => {
      const result = await query(args);

      return JSON.parse(
        JSON.stringify(result, (_, value) =>
          typeof value === "bigint"
            ? value.toString()
            : value
        )
      );
    },
  },
});

export { prisma };