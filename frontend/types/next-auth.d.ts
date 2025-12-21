import NextAuth from "next-auth";
import { UserType } from "./users";

declare module "next-auth" {
    interface Session {
        user: UserType;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: UserType;
    }
}