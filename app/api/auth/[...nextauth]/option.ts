// authOptions.ts
import { db } from "@/db";
import { members, users } from "@/db/schema"; // Your users table
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs"; // Secure password comparison
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
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
                const [userResult] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email))
                    .limit(1);

                if (!userResult) {
                    throw new Error("User not found");
                }

                // Compare password
                const isValidPassword = await compare(credentials.password, userResult.password);
                if (!isValidPassword) {
                    throw new Error("Invalid password");
                }

                // Find if the user is a member of any club
                const [clubmemberresult] = await db
                    .select()
                    .from(members)
                    .where(eq(members.userId, userResult.id))
                    .limit(1);

                let clubRole = clubmemberresult?.role || "";
                let clubId = clubmemberresult?.clubId || "";
                // If the user is not a member of any club, assign a default role (e.g., "guest" or "non-member")
                if (!clubmemberresult) {
                    clubRole = "non-member";  // Default role for non-members
                }

                // Return user info (JWT will store this)
                return {
                    id: userResult.id.toString(),
                    email: userResult.email,
                    name: userResult.firstname,
                    role: userResult.role,
                    clubRole,
                    clubId: Number(clubId),
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
                token.role = user.role;
                token.clubRole = user.clubRole;
                token.clubId = user.clubId;
            }
            return token;
        },
        async session({ session, token }) {
            // Add JWT fields to session
            if (token && session?.user) {
                session.user.id = token.id as string;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.role = token.role;
                session.user.clubRole = token.clubRole;
                session.user.clubId = token.clubId;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login", // Custom login page (optional)
        error: "/auth/error",  // Custom error page (optional)
    },
    secret: process.env.NEXTAUTH_SECRET!, // Very important! 🔒
};
