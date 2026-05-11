 drop database if exists film_database;
 create database film_database;

 \c film_database;

CREATE TABLE "Users" (
  "id" serial,
  "email" text,
  "password" text,
  "role" text,
  PRIMARY KEY ("id")
);

CREATE TABLE "Films" (
  "id" serial,
  "title" text,
  "release_year" int,
  "director" text,
  "description" text,
  "time_added" timestamp,
  "user_id" int,
  "is_analyzed" text,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_Films_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "Users"("id")
);

CREATE TABLE "Analyses" (
  "id" serial,
  "film_id" int,
  "user_id" int,
  "analysis_date" timestamp,
  "notes" text,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_Analyses_film_id"
    FOREIGN KEY ("film_id")
      REFERENCES "Films"("id"),
  CONSTRAINT "FK_Analyses_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "Users"("id")
);

CREATE TABLE "Lexical_Items" (
  "id" serial,
  "term" text,
  "definition" text,
  PRIMARY KEY ("id")
);

CREATE TABLE "Analysis_Findings" (
  "id" serial,
  "analysis_id" int,
  "item_id" int,
  "frequency" int,
  "context_example" text,
  "notes" text,
  PRIMARY KEY ("id"),
  CONSTRAINT "FK_Analysis_Findings_item_id"
    FOREIGN KEY ("item_id")
      REFERENCES "Lexical_Items"("id"),
  CONSTRAINT "FK_Analysis_Findings_analysis_id"
    FOREIGN KEY ("analysis_id")
      REFERENCES "Analyses"("id")
);