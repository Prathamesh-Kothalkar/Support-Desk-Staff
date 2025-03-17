import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/db";
import bcrypt from "bcryptjs";
import Staff from "@/models/staffModel";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                staffId: { label: "staffId:", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectToDB();

                const staff = await Staff.findOne({ staffId: credentials.staffId });

                if (!staff) {
                    return null;
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, staff.password);
                if (!isPasswordValid) {
                    return null;
                }

                return {
                    staffId: staff._id,
                    name: staff.name,
                    email: staff.email,
                    department: staff.department,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            session.user = token.user;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;

