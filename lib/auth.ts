import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      // Lazily import DB to avoid build-time initialization
      const { getDb } = await import("./db");
      const { users, accounts: accountsTable } = await import("./db/schema");
      const { eq } = await import("drizzle-orm");
      const db = getDb();

      // Upsert user
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);

      let userId: string;
      if (existing.length > 0) {
        userId = existing[0].id;
      } else {
        const [newUser] = await db
          .insert(users)
          .values({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
          })
          .returning();
        userId = newUser.id;
      }

      // Upsert account link
      if (account) {
        const existingAccount = await db
          .select()
          .from(accountsTable)
          .where(eq(accountsTable.providerAccountId, account.providerAccountId))
          .limit(1);

        if (existingAccount.length === 0) {
          await db.insert(accountsTable).values({
            userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token || null,
            access_token: account.access_token || null,
            expires_at: account.expires_at || null,
            token_type: account.token_type || null,
            scope: account.scope || null,
            id_token: account.id_token || null,
            session_state: account.session_state as string || null,
          });
        }
      }

      // Store userId in user object so JWT callback can access it
      user.id = userId;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
