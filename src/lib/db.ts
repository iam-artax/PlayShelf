"use client";

import {
  createRemoteEngines,
  Surreal,
} from "surrealdb";

import { createWasmEngines } from "@surrealdb/wasm";

let db: Surreal | null = null;
let connectionPromise: Promise<Surreal> | null = null;

export async function getDatabase(): Promise<Surreal> {
  if (db) {
    return db;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = initializeDatabase();

  try {
    db = await connectionPromise;
    return db;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

async function initializeDatabase(): Promise<Surreal> {
  const surreal = new Surreal({
    engines: {
      ...createRemoteEngines(),
      ...createWasmEngines(),
    },
  });

  await surreal.connect("indxdb://playshelf", {
    namespace: "playshelf",
    database: "playshelf",
  });

  await surreal.query(
    "DEFINE TABLE IF NOT EXISTS library SCHEMALESS;",
  );

  return surreal;
}