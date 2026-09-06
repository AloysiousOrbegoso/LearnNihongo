CREATE TABLE "kana_exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"script" text NOT NULL,
	"size" integer NOT NULL,
	"correct_count" integer NOT NULL,
	"taken_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kana_mastery" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"script" text NOT NULL,
	"character" text NOT NULL,
	"correct_streak" integer DEFAULT 0 NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"mastered" boolean DEFAULT false NOT NULL,
	"last_tested_at" timestamp with time zone,
	CONSTRAINT "kana_mastery_user_id_script_character_unique" UNIQUE("user_id","script","character")
);
--> statement-breakpoint
ALTER TABLE "kana_exams" ADD CONSTRAINT "kana_exams_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kana_mastery" ADD CONSTRAINT "kana_mastery_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "kana_exams_user_id_taken_at_idx" ON "kana_exams" USING btree ("user_id","taken_at");--> statement-breakpoint
ALTER TABLE "kana_exams" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "kana_mastery" ENABLE ROW LEVEL SECURITY;