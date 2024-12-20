import { pgTable, serial, text, timestamp, varchar, boolean, integer, uuid, jsonb } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Define the users table schema
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
  apiKey: uuid('api_key').defaultRandom(),
  remainingCredits: integer('remaining_credits').default(10),
  isActive: boolean('is_active').default(true),
});

// Define the generated_images table schema
export const generatedImages = pgTable('generated_images', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  imageUrl: varchar('image_url', { length: 1024 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  modelUsed: varchar('model_used', { length: 100 }),
  generationSettings: jsonb('generation_settings').default({}),
  status: varchar('status', { length: 50 }).default('completed'),
});

// Create the database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql);

// Export types for type safety
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type GeneratedImage = typeof generatedImages.$inferSelect;
export type NewGeneratedImage = typeof generatedImages.$inferInsert;