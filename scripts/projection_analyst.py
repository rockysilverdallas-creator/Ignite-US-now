import os
import json
from pathlib import Path
from google import genai
from dotenv import load_dotenv

def run_analyst():
    load_dotenv()
    
    # 1. Load targets
    json_path = Path("src/data/evolveNowCampaignTargets.json")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Flatten targets for the prompt
    target_summary = []
    for trade_key, trade_data in data.get("serviceLines", {}).items():
        for t in trade_data.get("targets", []):
            target_summary.append(f"[{t['id']}] {t['name']} ({trade_key}) - Entry: {t['ladderEntry']} | DNA: {t['strikeDna']}")

    # 2. Invoke Gemini for Discovery and Analytics
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = f"""
You are the Chief Analyst for the Ignitus Swarm.
We are executing the EVOLVE_NOW_CAMPAIGN.
The primary directive is to secure a $250/day kinetic cash floor via STAGE_1 engagements.

Here is the entire queue of available targets:
{chr(10).join(target_summary)}

YOUR DIRECTIVES:
1. Rank the Target Queue: Prioritize the top 20 targets with the absolute highest statistical probability of conversion. Focus on urgency (Storm/Emergency/Freeze) and low-friction entries (STAGE_1).
2. Calibrate the Yield Metrics: Outline the math to ensure the $250/day floor is hit with minimal waste.
3. Vector-to-Vertical Matching: Pinpoint which vectors (Tiana Voice vs DNA Site vs Applet) close fastest per trade.
4. Channel Friction Detection: Explain how to track drop-offs across the 5 communication tiers.

Output a highly realistic, numbers-driven strategic report in Markdown.
"""
    print("Initiating Discovery API to analyze Target Queue...")
    
    try:
        response = client.models.generate_content(
            model='gemini-3.8-flash', # Using standard flash
            contents=prompt,
        )
        report = response.text
        print("ANALYSIS COMPLETE. Writing artifact...")
        
        # Save to root workspace so the swarm can access it
        with open("target_propensity_ranking.md", "w", encoding="utf-8") as f:
            f.write(report)
        print("target_propensity_ranking.md successfully written.")
    except Exception as e:
        print(f"Discovery API Error: {e}")

if __name__ == "__main__":
    run_analyst()
