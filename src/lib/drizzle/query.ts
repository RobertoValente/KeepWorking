'server-only'

import { db } from "@/lib/drizzle/index";
import { user } from "@/lib/drizzle/schema";
import { User } from "@/lib/drizzle/type";
import { desc } from "drizzle-orm";

export const Query = {
    getUsers: async function(): Promise<User[]> {
        return await db
            .select()
            .from(user)
            .orderBy(
                desc(user.name)
            );
    },
}