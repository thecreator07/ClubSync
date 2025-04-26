CREATE TABLE "banners" (
	"id" serial PRIMARY KEY NOT NULL,
	"banner_image" varchar(500) NOT NULL,
	"banner_description" varchar(500) NOT NULL,
	"date" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"about" text NOT NULL,
	"contact_email" varchar(100),
	"contact_phone" varchar(20),
	"cover_image_url" varchar(255),
	"logo_image_url" varchar(255),
	"created_at" date DEFAULT now(),
	CONSTRAINT "clubs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"event_date" date NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"event_image" varchar(255),
	"location" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"registration_link" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "club_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"image_url" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"image_url" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"firstname" varchar(100),
	"lastname" varchar(100),
	"phone" varchar(100),
	"department" varchar(100),
	"year" integer,
	"semester" integer,
	"council" varchar(100),
	"social" varchar(100),
	"aoi" varchar(100),
	"role" varchar(100),
	"id_card" varchar(100),
	"verified" integer DEFAULT 0,
	"created_at" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"registered_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "memberships" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"club_id" integer NOT NULL,
	"role" varchar(20) DEFAULT 'member',
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rewards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"description" text NOT NULL,
	"points_spent" integer NOT NULL,
	"redeemed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "club_images" ADD CONSTRAINT "club_images_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "memberships" ADD CONSTRAINT "memberships_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;