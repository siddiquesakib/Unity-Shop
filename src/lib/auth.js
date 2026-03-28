import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
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
        loginToken: { label: "Login Token", type: "text" },
      },
      async authorize(credentials) {
        try {
          let res;

          if (credentials.loginToken) {
            res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: credentials.email,
                  token: credentials.loginToken,
                }),
              },
            );
          } else {
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            });
          }

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }

          return {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            sellerRequest: data.user.sellerRequest || null,
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
            user.id = data.user._id;
            user.role = data.user.role;
            user.sellerRequest = data.user.sellerRequest || null;
            user.backendToken = data.token;
          }
        } catch (error) {
          console.error("Error saving Google user to backend:", error);
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session: updateData }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sellerRequest = user.sellerRequest;
        token.backendToken = user.backendToken;
      }
      if (trigger === "update" && updateData?.role) {
        token.role = updateData.role;
      }
      if (trigger === "update" && updateData?.sellerRequest) {
        token.sellerRequest = updateData.sellerRequest;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.sellerRequest = token.sellerRequest;
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
};

export const getSession = () => getServerSession(authOptions);
