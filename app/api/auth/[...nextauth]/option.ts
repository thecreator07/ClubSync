// authOptions.ts
import { db } from "@/db";
import { users } from "@/db/schema"; // Your users table
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs"; // Secure password comparison
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions, Session } from "next-auth";
import { User as NextAuthUser } from "next-auth";

// Extend the Session and User types to include the 'id' property

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt", // use JWTs
    },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: Record<"email" | "password", string> | undefined): Promise<NextAuthUser | null> {
                if (!credentials?.email || !credentials.password) {
                    throw new Error("Missing email or password");
                }

                // Find user by email
                const userResult = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email))
                    .limit(1);

                const user = userResult[0];

                if (!user) {
                    throw new Error("User not found");
                }

                // Compare password
                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                // Return user info (JWT will store this)
                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: `${user.firstname} ${user.lastname}`.trim() || "", // Optional: if you want to add name to JWT
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            // First time JWT is created
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            // Add JWT fields to session
            if (token&& session?.user) {
                session.user.id = token.id as string; 
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login", // Custom login page (optional)
        error: "/auth/error",  // Custom error page (optional)
    },
    secret: process.env.NEXTAUTH_SECRET, // Very important! 🔒
};
