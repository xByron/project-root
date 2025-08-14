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
      res.status(400).send("<html><body><h1>Error: Missing 'player' query parameter</h1></body></html>");
      return;
    }

    const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${encodeURIComponent(player)}`;
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).send(`<html><body><h1>Highscores fetch failed (${response.status})</h1></body></html>`);
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

    // Create HTML output so GPT's browser tool can read it
    const htmlOutput = `
      <html>
        <head><title>OSRS Stats for ${player}</title></head>
        <body>
          <h1>Stats for ${player}</h1>
          <pre>${JSON.stringify({ player, skills }, null, 2)}</pre>
        </body>
      </html>
    `;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(htmlOutput);

  } catch (err) {
    res.status(500).send(`<html><body><h1>Server Error: ${err.message}</h1></body></html>`);
  }
};
