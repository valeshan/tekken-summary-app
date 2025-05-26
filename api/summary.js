export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Only POST allowed' });
  
    const stats = req.body;
  
    const prompt = `
You are a witty Tekken 8 commentator summarizing players based on stats. Use humor, but be accurate.

The stats below are real. Do NOT invent anything. Do not say "the stats are a mystery." If stats are maxed out (25), praise them. If under 15, call them out with flair.

NEVER use the word "Pentagon." Stay under 150 characters.

Stats:
{
Attack: { Frequency: ${stats.attack_frequency}, Heavy: ${stats.heavy_damage}, Aggro: ${stats.aggressiveness}, Dominance: ${stats.dominance} },
Defense: { Block: ${stats.block}, Evasion: ${stats.evasion}, ThrowEscape: ${stats.throw_escape}, Composure: ${stats.composure} },
Technique: { Accuracy: ${stats.accuracy}, Judgement: ${stats.judgement}, Retaliation: ${stats.retaliation}, StageUse: ${stats.stage_use} },
Spirit: { CloseBattles: ${stats.close_battles}, Comeback: ${stats.comeback}, FightingSpirit: ${stats.fighting_spirit}, Concentration: ${stats.concentration} },
Appeal: { Respect: ${stats.respect}, Ambition: ${stats.ambition}, Fairness: ${stats.fairness}, Versatility: ${stats.versatility} },
Match: { WinRate: ${stats.win_rate}%, RoundsWon: ${stats.rounds_won}, RoundsLost: ${stats.rounds_lost}, CloseMatches: ${stats.close_matches}, MaxStreak: ${stats.max_win_streak}, MaxLoss: ${stats.max_loss_streak} }
}

`;
//   console.log(prompt)
//   return;

const result = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150,
      stop: ['---', 'Input:']
    })
  });

    // const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     model: "meta-llama/Llama-3-8b-chat-hf",
    //     messages: [
    //       { role: "system", content: "You are a Tekken 8 analyst and witty commentator." },
    //       { role: "user", content: prompt }
    //     ],
    //     max_tokens: 150,
    //     temperature: 0.85
    //   })
    // });
  
    const data = await result.json();
    const summary = data.choices?.[0]?.message?.content || "No summary generated.";
    res.status(200).json({ summary });
  }