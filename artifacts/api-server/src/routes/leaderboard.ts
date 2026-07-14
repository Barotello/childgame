import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, leaderboardEntriesTable } from "@workspace/db";
import { ListLeaderboardEntriesResponse, LeaderboardEntryInput, UpsertLeaderboardEntryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leaderboard/entries", async (req, res): Promise<void> => {
  const rawLimit = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const parsedLimit = typeof rawLimit === "string" ? parseInt(rawLimit, 10) : NaN;
  const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 200) : 100;

  const rows = await db
    .select()
    .from(leaderboardEntriesTable)
    .orderBy(desc(leaderboardEntriesTable.coins))
    .limit(limit);

  const entries = rows.map((row, index) => ({
    id: row.id,
    nickname: row.nickname,
    coins: row.coins,
    avatar: row.avatar,
    rank: index + 1,
    updatedAt: row.updatedAt,
  }));

  res.json(ListLeaderboardEntriesResponse.parse(entries));
});

router.post("/leaderboard/entries", async (req, res): Promise<void> => {
  const parsed = LeaderboardEntryInput.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid leaderboard entry input");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { deviceId, nickname, coins, avatar } = parsed.data;

  const [row] = await db
    .insert(leaderboardEntriesTable)
    .values({ deviceId, nickname, coins, avatar })
    .onConflictDoUpdate({
      target: leaderboardEntriesTable.deviceId,
      set: { nickname, coins, avatar },
    })
    .returning();

  const higherCount = await db
    .select()
    .from(leaderboardEntriesTable)
    .where(undefined);

  const allRows = await db
    .select()
    .from(leaderboardEntriesTable)
    .orderBy(desc(leaderboardEntriesTable.coins));
  const rank = allRows.findIndex((r) => r.id === row.id) + 1;

  res.json(
    UpsertLeaderboardEntryResponse.parse({
      id: row.id,
      nickname: row.nickname,
      coins: row.coins,
      avatar: row.avatar,
      rank,
      updatedAt: row.updatedAt,
    }),
  );
});

export default router;
