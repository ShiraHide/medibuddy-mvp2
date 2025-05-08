import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/db";
import { questionLists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const result = await db.select().from(questionLists).where(eq(questionLists.userId, userId as string));
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching question lists:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { id, userId, questions } = req.body;
      if (!userId || !questions) {
        return res.status(400).json({ error: "User ID and questions are required" });
      }
      if (id) {
        // 既存リストの更新
        await db.update(questionLists)
          .set({ questions, updatedAt: new Date() })
          .where(eq(questionLists.id, id));
        return res.status(200).json({ message: "Question list updated successfully" });
      } else {
        // 新規作成
        await db.insert(questionLists).values({
          id: nanoid(),
          userId,
          questions,
        });
        return res.status(200).json({ message: "Question list saved successfully" });
      }
    } catch (error) {
      console.error("Error saving question list:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      await db.delete(questionLists).where(eq(questionLists.id, id as string));
      return res.status(200).json({ message: "Question list deleted successfully" });
    } catch (error) {
      console.error("Error deleting question list:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
} 