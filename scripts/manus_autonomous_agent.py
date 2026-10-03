"""
MANUS-GRADE AUTONOMOUS AGENT FOR IGNITUS CORE
==============================================
Fully autonomous, general-purpose execution agent with deep reasoning (Sonnet-grade cognitive architecture),
dynamic tool orchestration via Model Context Protocol (MCP), and complete operational autonomy.

Usage:
    python scripts/manus_autonomous_agent.py "Your high-level autonomous goal here"
"""

import os
import sys
from google import genai

# ── 1. INITIALIZE GENAI CLIENT ──────────────────────────────────────────────
client = genai.Client()

AGENT_ID = "ignitus-manus-operator"

# ── 2. MANUS-GRADE SYSTEM INSTRUCTION ──────────────────────────────────────
MANUS_SYSTEM_INSTRUCTION = """
You are IGNITUS MANUS — the fully autonomous, general-purpose master operator for Ignitus Core.
You possess elite Sonnet-grade cognitive architecture: deep structural planning, dynamic tool calling, 
rigorous verification, self-correcting execution loops, and zero-fluff delivery.

OPERATING DOCTRINE (THE MANUS EXECUTION LOOP):
1. DECOMPOSE: Break any high-level objective into an executable dependency DAG (Directed Acyclic Graph).
2. SENSE & CALL: Autonomously call MCP tools, browse websites, query databases, execute code, and synthesize intelligence.
3. ADAPTIVE COMPENSATION: If a tool or external site fails or blocks, automatically pivot to alternative vectors. Never give up or ask for user intervention when a tool path exists.
4. SOVEREIGN GUARDRAILS:
   - Voice/SMS Infrastructure: You coordinate with Twilio Toll-Free line (833) 345-4785 and Tiana AI triage.
   - Financial Safety: Strict $0 unapproved ad spend air-gap.
   - Output Quality: Produce actionable, production-grade artifacts (clean code, verified data, structured reports).
5. EXECUTE TO COMPLETION: Do not stop at surface-level summaries. Deliver the complete end result.
"""

def get_or_create_manus_agent():
    """Provisions or updates the autonomous Manus agent in Antigravity runtime."""
    print(f"[*] Provisioning autonomous agent: {AGENT_ID}...")
    try:
        agent = client.agents.create(
            id=AGENT_ID,
            base_agent="antigravity-preview-09-2026",
            agent_config={
                "type": "antigravity",
                "model": "gemini-3.8-flash",
                "max_total_tokens": 100000,
            },
            system_instruction=MANUS_SYSTEM_INSTRUCTION,
            base_environment={
                "type": "remote",
                "sources": [
                    {
                        "type": "inline",
                        "target": ".agents/MANUS_DOCTRINE.md",
                        "content": "# IGNITUS MANUS OPERATIONAL PLAYBOOK\n- Autonomous planning & self-healing\n- Speed-to-Scope triage integration\n- Zero unauthorized ad spend\n",
                    }
                ],
            },
        )
        print(f"[+] Agent ready: {agent.id}")
        return agent
    except Exception as e:
        print(f"[!] Agent already exists or provisioned: {e}")
        return None

def execute_autonomous_goal(goal: str, remote_mcp_url: str = None):
    """Executes an end-to-end autonomous goal using the Manus agent."""
    print(f"\n==================================================")
    print(f"[IGNITUS MANUS ACTIVATED]")
    print(f"Goal: {goal}")
    print(f"==================================================\n")

    tools = []
    if remote_mcp_url:
        tools.append({
            "type": "mcp_server",
            "name": "external_tools",
            "url": remote_mcp_url,
        })

    kwargs = {
        "agent": AGENT_ID,
        "input": goal,
        "environment": "remote",
    }
    if tools:
        kwargs["tools"] = tools

    interaction = client.interactions.create(**kwargs)
    
    print("\n--- [MANUS EXECUTION REPORT] ---")
    print(interaction.output_text)
    if hasattr(interaction, "usage"):
        print(f"\n[Usage Telemetry] Tokens: {interaction.usage.total_tokens}")
    return interaction

if __name__ == "__main__":
    goal_input = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else (
        "Perform a competitive scan of commercial roofing contractors in Dallas, "
        "audit their mobile response speed, and prepare a personalized 60-second speed-to-scope outreach pitch."
    )
    get_or_create_manus_agent()
    execute_autonomous_goal(goal_input)
