import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/db/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const result = await db.select().from(users).where(eq(users.id, id as string));
      
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      return res.status(200).json(result[0]);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const userData = req.body;
      
      if (!userData.name) {
        return res.status(400).json({ error: "Name is required" });
      }

      // 既存のユーザーを更新または新規作成
      const existingUser = await db.select().from(users).where(eq(users.id, userData.id));
      
      if (existingUser.length > 0) {
        await db.update(users)
          .set({
            name: userData.name,
            gender: userData.gender,
            age: userData.age,
            income: userData.income,
            family: userData.family,
            history: userData.medicalHistory,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userData.id));
      } else {
        await db.insert(users).values({
          id: userData.id,
          name: userData.name,
          gender: userData.gender,
          age: userData.age,
          income: userData.income,
          family: userData.family,
          history: userData.medicalHistory,
        });
      }
      
      return res.status(200).json({ message: "User saved successfully" });
    } catch (error) {
      console.error("Error saving user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
