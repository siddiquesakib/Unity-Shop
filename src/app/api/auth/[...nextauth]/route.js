import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          // Return user object for NextAuth session
          return {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            image: data.user.image || null,
            backendToken: data.token,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // When user signs in with Google, save/update them in our backend
      if (account.provider === "google") {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: user.name,
                email: user.email,
                image: user.image,
                googleId: account.providerAccountId,
              }),
            },
          );

          const data = await res.json();

          if (res.ok) {
            // Attach backend data to user object
            user.id = data.user._id;
            user.role = data.user.role;
            user.backendToken = data.token;
          }
        } catch (error) {
          console.error("Error saving Google user to backend:", error);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // On first sign in, add custom fields to JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.backendToken = user.backendToken;
      }
      return token;
    },
    async session({ session, token }) {
      // Send custom fields to the client session
      session.user.id = token.id;
      session.user.role = token.role;
      session.backendToken = token.backendToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
