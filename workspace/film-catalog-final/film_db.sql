 drop database if exists film_database;
 create database film_database;

 \c film_database;

CREATE TABLE "admin" (
  "id" serial primary key,
  "email" text,
  "password" text,
  "name" text,
  "salt" text
);

CREATE TABLE "films" (
  "id" serial primary key,
  "title" text,
  "release_year" int,
  "director" text,
  "description" text,
  "time_added" timestamp,
  "user_id" int,
  "is_analyzed" text
);

CREATE TABLE "analyses" (
  "id" serial primary key,
  "film_id" int,
  "user_id" int,
  "analysis_date" timestamp,
  "notes" text
);

CREATE TABLE "terms" (
  "id" serial primary key,
  "lexical_item" text,
  "definition" text
);

CREATE TABLE "analysis_findings" (
  "id" serial primary key,
  "analysis_id" int,
  "term_id" int,
  "frequency" int,
  "context_example" text,
  "notes" text
);
