import { todos } from "@schema";
import { defineHandler } from "void";
import { db, eq } from "void/db";

export const PATCH = defineHandler(async (c) => {
  try {
    const strId = await c.req.param("id");
    const id = Number(strId);
    const { completed } = await c.req.json();
    const updated = await db
      .update(todos)
      .set({
        completed: completed,
      })
      .where(eq(todos.id, id))
      .returning();
    if (updated) {
      return c.json({ id: id, message: "Updated successfully" }, 200);
    } else {
      return c.json({ error: "Todo not found" }, 404);
    }
  } catch {
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

export const DELETE = defineHandler(async (c) => {
  try {
    const strId = await c.req.param("id");
    const id = Number(strId);
    const deleted = await db.delete(todos).where(eq(todos.id, id)).returning();
    if (deleted) {
      return c.json({ id: id, message: "Deleted successfully" }, 200);
    } else {
      return c.json({ error: "Todo not found" }, 404);
    }
  } catch {
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});
