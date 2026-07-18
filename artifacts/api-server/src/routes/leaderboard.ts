import { Router, type IRouter } from "express";
import { desc, gt, sql } from "drizzle-orm";
import { db, leaderboardEntriesTable } from "@workspace/db";
import {
  ListLeaderboardEntriesResponse,
  UpsertLeaderboardEntryBody,
  UpsertLeaderboardEntryResponse,
} from "@workspace/api-zod";

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
  const parsed = UpsertLeaderboardEntryBody.safeParse(req.body);
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

  const [higherCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leaderboardEntriesTable)
    .where(gt(leaderboardEntriesTable.coins, row.coins));
  const rank = Number(higherCount.count) + 1;

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
