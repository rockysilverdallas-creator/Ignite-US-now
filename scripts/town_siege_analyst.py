import os
from google import genai
from dotenv import load_dotenv

def run_analyst():
    load_dotenv()
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    
    prompt = """
You are the Chief Analyst for the Ignitus Swarm.
We are executing the EVOLVE_NOW_CAMPAIGN.
The Exhaustion Protocol step 4 is: "Quaternary (THE TOWN HALL SIEGE): Subagent intelligence scout. Locate where this specific community/trade resides, shares information, makes decisions, and consumes media (e.g., Reddit, FB Groups, Forums). Secure a seat in the community hub and stage a multimedia asset blast (the 9:16 vertical video) to force consumption at scale."

The commander asks: "Will we get banned and removed from the people we want to get in front of if we practice this Town Hall Siege?"

Give a stark, realistic, and highly strategic answer. Assess the risks of shadowbanning, moderation backlash, and community alienation vs the reward of forced scale consumption. Provide an execution strategy to mitigate these bans while still achieving the objective.
"""
    
    response = client.models.generate_content(
        model='gemini-3.8-flash',
        contents=prompt,
    )
    print(response.text)

if __name__ == "__main__":
    run_analyst()
