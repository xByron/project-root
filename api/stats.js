// Vercel Node functions support global fetch on Node 18+
// CommonJS export for maximum compatibility.

const SKILLS = [
  "Overall","Attack","Defence","Strength","Hitpoints","Ranged","Prayer",
  "Magic","Cooking","Woodcutting","Fletching","Fishing","Firemaking","Crafting",
  "Smithing","Mining","Herblore","Agility","Thieving","Slayer","Farming",
  "Runecrafting","Hunter","Construction"
];

module.exports = async (req, res) => {
  try {
    const player = req.query.player;
    if (!player) {
      res.status(400).json({ error: "Missing 'player' query parameter" });
      return;
    }

    const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(player)}`;
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: `Highscores fetch failed (${response.status})` });
      return;
    }

    const text = await response.text();
    const lines = text.trim().split("\n");

    const skills = {};
    for (let i = 0; i < SKILLS.length; i++) {
      const line = lines[i];
      if (!line) break;
      const [rank, level, xp] = line.split(",").map(Number);
      skills[SKILLS[i]] = { rank, level, xp };
    }

    // CORS so your GPT can fetch it
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
    res.status(200).json({ player, skills });
  } catch (err) {
    res.status(500).json({ error: err.message || "Unknown server error" });
  }
};
