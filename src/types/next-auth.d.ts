import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      firstName?: string;
      lastName?: string;
      profileImage?: string;
      avatar?: string;
      branch: any;
    } & DefaultSession["user"];
  }
  
  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    role: string;
    branch: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    branch: any;
  }
}
