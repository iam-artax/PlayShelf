import { NextRequest, NextResponse } from "next/server";

import { searchGames } from "@/lib/rawg";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query?.trim()) {
    return NextResponse.json(
      { error: "Search query is required" },
      { status: 400 },
    );
  }

  try {
    const games = await searchGames(query.trim());

    return NextResponse.json({
      results: games,
    });
  } catch (error) {
    console.error("Game search failed:", error);

    return NextResponse.json(
      { error: "Failed to search games" },
      { status: 500 },
    );
  }
}