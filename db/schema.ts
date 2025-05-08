import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

// ユーザーテーブル
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender"),
  age: integer("age"),
  income: integer("income"),
  family: text("family"),
  history: text("history"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 質問リストテーブル
export const questionLists = pgTable("question_lists", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  questions: text("questions"), // 改行区切りで保存
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
