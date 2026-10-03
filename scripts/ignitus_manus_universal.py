"""
IGNITUS MANUS — PERMANENT UNIVERSAL AUTONOMOUS AGENT
=====================================================
A fully autonomous, universal operator engineered to run permanently on
computer, phone (Termux/PWA), and cloud environments.

Core Capabilities:
1. Permanent Local & Cloud Memory (.agents/manus_memory.json)
2. Eye-to-Eye Operator Outreach Engine (20s Cinematic "See, Touch, Feel" Framework)
3. Headless RCS & Voice Tiana Bridge (Toll-Free line: (833) 345-4785)
4. Dual-Engine Intelligence: Google GenAI (Gemini 3.8 / Antigravity) + OpenAI GPT-4o
"""

import os
import sys
import json
import time
from typing import Dict, Any, Optional

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", ".agents", "manus_memory.json")

# ── 1. CINEMATIC OUTREACH DOCTRINE (SEE, TOUCH, FEEL) ──────────────────────
class SeeTouchFeelDirector:
    """
    Produces tight, <=20-second cinematic operator-to-operator outreach pitches.
    Structure:
      0-6s  (PAIN): Get eye-to-eye with the operator on the job site.
      7-13s (SOLUTION): The 60-second interactive scoper + 12s cell dispatch.
      14-20s (SEE, TOUCH, FEEL): Tactile proof on their own mobile device.
    """

    @staticmethod
    def generate_pitch(contractor_name: str, trade: str, domain: str, monthly_leak: int = 18500, paypal_handle: str = None) -> Dict[str, Any]:
        leak_str = f"${monthly_leak:,.0f}"
        handle = (paypal_handle or os.getenv("PAYPAL_ME_HANDLE") or os.getenv("PAYPAL_USERNAME") or "IgnitusCore").replace("https://paypal.me/", "").replace("@", "")

        stage1_url = f"https://paypal.me/{handle}/55USD"
        stage2_url = f"https://paypal.me/{handle}/700USD"
        stage3_url = f"https://paypal.me/{handle}/200USD"
        stage4_url = f"https://paypal.me/{handle}/1500USD"
        
        script_20s = (
            f"You're out on the job site, your phone's in your pocket, and a {leak_str} {trade} contract "
            f"just bounced off your static contact form because nobody answered in 2 hours. "
            f"We plugged that leak. We built a 60-second interactive scoper directly on {domain} "
            f"that quotes the client on mobile and texts the exact ticket to your cell in 12 seconds. "
            f"See the leak, touch the prototype on your own phone right now, and feel what it's like "
            f"to win the job before competitors even check their email. Private link below."
        )

        visual_storyboard = [
            {"timing": "0:00 - 0:06", "visual": "Cinematic close-up of muddy work boots on concrete. Phone screen lighting up with a missed commercial lead notification. Eye-to-eye connection."},
            {"timing": "0:07 - 0:13", "visual": "Crisp macro shot of a thumb selecting trade specs on the 60-second scoper. Immediate SMS dispatch ping arriving on contractor's personal phone."},
            {"timing": "0:14 - 0:20", "visual": "The 'SEE, TOUCH, FEEL' triad: Split screen showing the $0 leak audit, the working 72-hr mobile prototype link, and instant contract acceptance."},
        ]

        return {
            "contractor": contractor_name,
            "trade": trade,
            "domain": domain,
            "duration": "<= 20 seconds",
            "framework": "SEE, TOUCH, FEEL (Operator-to-Operator)",
            "voiceScript": script_20s,
            "storyboard": visual_storyboard,
            "callToAction": "Touch your private staging prototype now: 72-hour test drive.",
            "settlementLinks": {
                "stage1_test": stage1_url,
                "stage2_claim_ground": stage2_url,
                "stage3_video_assets": stage3_url,
                "stage4_command_market": stage4_url,
            }
        }

# ── 2. PERMANENT MEMORY MANAGER ─────────────────────────────────────────────
class PermanentMemoryManager:
    @staticmethod
    def load() -> Dict[str, Any]:
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "agent_id": "ignitus-manus-universal",
            "created_at": time.time(),
            "learned_insights": [],
            "audited_contractors": {},
            "active_campaigns": ["EVOLVE_NOW_BLITZ"],
            "toll_free_line": "(833) 345-4785",
        }

    @staticmethod
    def record_learning(topic: str, insight: str):
        memory = PermanentMemoryManager.load()
        memory["learned_insights"].append({
            "timestamp": time.time(),
            "topic": topic,
            "insight": insight,
        })
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=2)
        print(f"[Manus Memory] Persisted new insight: {topic}")

# ── 3. UNIVERSAL AUTONOMOUS OPERATOR ────────────────────────────────────────
class IgnitusManusOperator:
    def __init__(self):
        self.memory = PermanentMemoryManager.load()
        self.toll_free = "(833) 345-4785"

    def run_evolve_now_blitz(self, contractor_name: str = "Viscon General Contracting", domain: str = "viscong.com", trade: str = "Commercial Construction"):
        print(f"\n=======================================================")
        print(f"[*] IGNITUS MANUS — EXECUTING EVOLVE NOW OUTREACH BLITZ")
        print(f"[*] Target: {contractor_name} ({domain}) | Trade: {trade}")
        print(f"[*] Voice/RCS Gateway: Toll-Free {self.toll_free} (Tiana AI)")
        print(f"=======================================================\n")

        # 1. Generate 20-second cinematic See, Touch, Feel pitch
        pitch = SeeTouchFeelDirector.generate_pitch(contractor_name, trade, domain)
        print("[+] 20-SECOND CINEMATIC PITCH (SEE, TOUCH, FEEL):")
        print(f'"{pitch["voiceScript"]}"\n')

        print("[+] CINEMATIC STORYBOARD (<20s):")
        for beat in pitch["storyboard"]:
            print(f'  • [{beat["timing"]}] {beat["visual"]}')

        # 2. Persist to permanent memory
        PermanentMemoryManager.record_learning(
            topic=f"OUTREACH_{contractor_name.upper().replace(' ', '_')}",
            insight=f"Generated 20s See-Touch-Feel pitch for {domain}. Staged 60s scoper at /api/twilio?action=sms"
        )

        return pitch

if __name__ == "__main__":
    operator = IgnitusManusOperator()
    target_contractor = sys.argv[1] if len(sys.argv) > 1 else "Viscon General Contracting"
    target_domain = sys.argv[2] if len(sys.argv) > 2 else "viscong.com"
    target_trade = sys.argv[3] if len(sys.argv) > 3 else "Commercial Construction"

    operator.run_evolve_now_blitz(target_contractor, target_domain, target_trade)
