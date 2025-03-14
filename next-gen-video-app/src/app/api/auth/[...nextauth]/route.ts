import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: "698525706418-gv8aroa3ombmqu2g8lpqq9j9skqotan4.apps.googleusercontent.com" as string,
      clientSecret: "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" as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
