import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        name?: string | null;
        email?: string | null;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        email?: string | null;
        name?: string | null;
    }
}