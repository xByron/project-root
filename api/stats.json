import fetch from "node-fetch";

const SKILLS = [
  "Overall","Attack","Defence","Strength","Hitpoints","Ranged","Prayer",
  "Magic","Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting",
  "Smithing","Mining","Herblore","Agility","Thieving","Slayer","Farming",
  "Runecrafting","Hunter","Construction"
];

export default async function handler(req, res) {
  const { player } = req.query;
  if (!player) {
    return res.status(400).json({ error: "Missing 'player' query parameter" });
  }

  try {
    const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(player)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch highscores");

    const text = await response.text();
    const lines = text.trim().split("\n");

    const result = {};
    SKILLS.forEach((skill, i) => {
      const [rank, level, xp] = lines[i].split(",");
      result[skill] = {
        rank: parseInt(rank, 10),
        level: parseInt(level, 10),
        xp: parseInt(xp, 10)
      };
    });

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json({ player, skills: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
