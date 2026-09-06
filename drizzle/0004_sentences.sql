CREATE TABLE "sentence_exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tier" text NOT NULL,
	"correct_count" integer NOT NULL,
	"total" integer NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sentence_mastery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"tier" text NOT NULL,
	"point_key" text NOT NULL,
	"correct_streak" integer DEFAULT 0 NOT NULL,
	"mastered" boolean DEFAULT false NOT NULL,
	"last_tested_at" timestamp with time zone,
	CONSTRAINT "sentence_mastery_user_id_tier_point_key_unique" UNIQUE("user_id","tier","point_key")
);
--> statement-breakpoint
ALTER TABLE "sentence_exams" ADD CONSTRAINT "sentence_exams_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sentence_mastery" ADD CONSTRAINT "sentence_mastery_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sentence_exams_user_id_taken_at_idx" ON "sentence_exams" USING btree ("user_id","taken_at");--> statement-breakpoint
ALTER TABLE "sentence_exams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sentence_mastery" ENABLE ROW LEVEL SECURITY;