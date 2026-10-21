import { todos } from "@schema";
import { defineHandler } from "void";
import { db } from "void/db";

export const GET = defineHandler(async () => {
  return db.select().from(todos);
});

export const POST = defineHandler(async (c) => {
  const { title } = await c.req.json<{ title: string }>();
  const newTodo = {
    title: title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  const created = await db.insert(todos).values(newTodo).returning();
  return {
    id: created[0].id,
    title: created[0].title,
    completed: created[0].completed,
    createdAt: created[0].createdAt,
  };
});
