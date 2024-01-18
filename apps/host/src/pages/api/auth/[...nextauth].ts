import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface User {
    id: number;
    name: string;
    email: string;
  }
}

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@correo.com",
          value: "example@correo.com",
        },
      },
      async authorize(credentials) {
        const user = {
          id: 1,
          name: "Tony Stark",
          email: "example@correo.com",
        };
        if (credentials?.email === user.email) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
  },
};

export default NextAuth(authOptions);
