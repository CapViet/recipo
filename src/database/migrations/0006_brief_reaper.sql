ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "country" ADD COLUMN "recipe_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "status" text;--> statement-breakpoint
ALTER TABLE "recipe" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "recipe" ADD CONSTRAINT "recipe_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;