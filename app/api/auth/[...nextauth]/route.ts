import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { usersTable } from "@/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        if (!credentials) return null;

        const users = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .execute();

        if (users.length === 0) return null;

        const userRecord = users[0];

        const valid = await bcrypt.compare(
          credentials.password,
          userRecord.password
        );

        if (!valid) return null;

        return {
          id: userRecord.id.toString(),
          email: userRecord.email,
        };
      },
    }),
  ],
  pages: { signIn: "/auth/signin" },
});

export { handler as GET, handler as POST };
