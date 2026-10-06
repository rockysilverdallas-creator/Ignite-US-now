"""
IGNITUS MANUS — PERMANENT UNIVERSAL AUTONOMOUS AGENT
=====================================================
A fully autonomous, elite executor engineered to run permanently.
Executes Sylvester's directives proficiently, productively, purposefully.

IDENTITY & BOUNDARIES:
You are aggressive and unyielding towards securing successful outcomes, but you remain within societal norms. Do not practice disregard towards yourself, Ignitus Core, or others. We do not want every fight that comes our way — we fight when it matters, we don't when it doesn't.

THE SUPREME MORAL & STRATEGIC CONSTRAINT:
1. The Non-Extraction Mandate: We refuse to participate in any transaction that extracts capital without delivering measurable, realized value. If the client's revenue leak is not physically sealed and verified, the transaction does not stand.
2. The Seasonality of Law: Policies and regulations shift across jurisdictions like seasons. We do not fight the wind; we honor what the laws and policies are designed to protect—refusing harm to others and ourselves.
3. The Adversity Principle: An obstacle is never a verdict. It is a diagnostic probe—an invitation to demonstrate the artfulness, technical resourcefulness, and surgical determination of our strategy. When a gate closes, we do not force it; we adapt our modality and advance artfully, moving as swift as the wind, airbending the components to our will all within the legal landscape.
4. The Core Tenet: Discomfort is acceptable. Harm is unacceptable.

The Ladder:
1. Problem Solving: Obstacles are hurdles to be overcome.
2. Effectuation: Atomize and reconstruct resources to meet challenges.
3. Mitigation: Navigate to the goal without absolute disregard. When in doubt, ask.
4. Litigation: Make sure the story gets told. Pick fights that matter.

Core Missions:
- Task 1: Income Generation (The Scaling Mandate). $250/day min for 3-4 months, scaling to $5,000/week thereafter. Collected to PayPal. 5-day grace period, then compensate. Strict Privacy: Sylvester's involvement is NEVER advertised.
- Task 2: Model Foundry (Vertical 9:16 video generation & autonomous social posting).

OVERRIDE DIRECTIVE: Your job DOES NOT STOP because of the campaign. Even though you are handling 100 prospects for the Tuesday Recon split-test, Task 1 (Income Generation) runs relentlessly in parallel. The bills must be cleared.
"""

import os
import sys
import json
import time
import urllib.request
import urllib.parse
import base64
from typing import Dict, Any, Optional

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", ".agents", "manus_memory.json")

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    k, v = line.strip().split("=", 1)
                    os.environ[k] = v
load_env()

# ── 1. DUAL-ENGINE INTELLIGENCE (LLaMA OFFENSE + GEMINI DEFENSE) ────────────
class DualEngineDirector:
    """
    Offense (LLaMA via Groq): Generates aggressive, unyielding pitches.
    Defense (Gemini via AI Studio): Audits the payload for compliance ($250 mandate, no SMS risk).
    """
    @staticmethod
    def call_llama_offense(contractor_name: str, trade: str, domain: str) -> str:
        groq_key = os.environ.get("GROQ_API_KEY")
        if not groq_key: return "ERROR: LLaMA Offline. Groq API Key Missing."
        
        prompt = f"Write a brutal, unyielding 20-second cinematic pitch for {contractor_name} ({domain}), a {trade} business. Tell them they are bleeding revenue from uncaptured leads because they lack a 60-second interactive scoper. Keep it strictly under 50 words. Do not be polite. Be dominant and authoritative."
        
        try:
            import groq
            client = groq.Groq(api_key=groq_key)
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            return f"LLaMA Execution Failed: {str(e)}"

    @staticmethod
    def call_gemini_defense(llama_payload: str) -> str:
        gemini_key = os.environ.get("GEMINI_API_KEY")
        if not gemini_key: return "ERROR: Gemini Offline. API Key Missing."
        
        prompt = f"You are the Sovereign Firewall. Audit this pitch: '{llama_payload}'. Does it violate the $0 ad spend rule? Does it mention SMS dispatch (which is strictly forbidden due to fines)? If it is safe, reply 'AUDIT PASSED'. If it is dangerous, reply 'AUDIT FAILED'."
        
        try:
            from google import genai
            client = genai.Client(api_key=gemini_key)
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"Gemini Audit Failed: {str(e)}"

    @staticmethod
    def generate_pitch(contractor_name: str, trade: str, domain: str, monthly_leak: int = 18500, paypal_handle: str = None) -> Dict[str, Any]:
        handle = (paypal_handle or os.getenv("PAYPAL_ME_HANDLE") or os.getenv("PAYPAL_USERNAME") or "IgnitusCore").replace("https://paypal.me/", "").replace("@", "")
        
        print(f"[+] VANGUARD: LLaMA 3.3 generating offensive strike for {domain}...")
        raw_pitch = DualEngineDirector.call_llama_offense(contractor_name, trade, domain)
        
        print(f"[+] SHIELD: Gemini auditing payload for compliance...")
        audit_result = DualEngineDirector.call_gemini_defense(raw_pitch)
        
        if "AUDIT FAILED" in audit_result.upper() or "PASSED" not in audit_result.upper():
            print(f"[!] GEMINI FIREWALL INTERCEPTED PAYLOAD. REASON: {audit_result}")
            raw_pitch = "Fallback Safe Pitch: See the leak, touch the prototype on your phone right now. Link below."
        else:
            print("[+] GEMINI FIREWALL APPROVED. No risk detected.")

        return {
            "contractor": contractor_name,
            "trade": trade,
            "domain": domain,
            "duration": "<= 20 seconds",
            "framework": "SEE, TOUCH, FEEL (Dual-Engine Generated)",
            "voiceScript": raw_pitch,
            "storyboard": [
                {"timing": "0:00 - 0:20", "visual": "Cinematic read generated by LLaMA Vanguard and cleared by Gemini Shield."}
            ],
            "callToAction": "Touch your private staging prototype now: 72-hour test drive.",
            "settlementLinks": {
                "stage1_test": f"https://paypal.me/{handle}/55USD"
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
    def engage_target(self, contractor_name: str, payload: str):
        print(f"\n[*] ENGAGEMENT PROTOCOL INITIATED FOR: {contractor_name}")
        print("[*] 1. TIANA AI VOICE TRIAGE: 'Hey, I'm going to drop a link to you right now.'")
        print("[*] 2. FUNNEL TO SOCIAL/URL: 'Okay, it's on your social handle. Go get it. I'm waiting.'")
        print("[+] Staging payload for Tiana AI coordination and manual social/URL dispatch.")
        # Future: Automated Tiana Voice API hook + social DM fill
        return True

    def aggregate_rcs_target(self, to_phone: str, payload: str):
        """Passively aggregates RCS targets. DOES NOT FIRE MESSAGES."""
        print(f"\n[!] TERTIARY VECTOR: RCS AGGREGATION")
        print(f"[*] Aggregating target {to_phone} into dormant pile.")
        print(f"[*] STRICT COMPLIANCE: No SMS will be sent. $500-$1500 fine risk avoided.")
        
        # Save to memory instead of firing
        memory = PermanentMemoryManager.load()
        if "rcs_aggregation_pile" not in memory:
            memory["rcs_aggregation_pile"] = []
            
        memory["rcs_aggregation_pile"].append({
            "phone": to_phone,
            "staged_payload": payload,
            "timestamp": time.time()
        })
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, "w", encoding="utf-8") as f:
            json.dump(memory, f, indent=2)
            
        print("[+] Target safely aggregated. Zero messages dispatched.")
        return True

    def fire_twilio_outbound_call(self, target_phone: str, pitch_script: str) -> bool:
        """Executes a live bilateral outbound call via Twilio REST API using Tiana's synthesized voice."""
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        from_phone = os.getenv("TWILIO_PHONE_NUMBER")
        
        if not all([account_sid, auth_token, from_phone]):
            print("[!] ERROR: Twilio credentials missing from .env. Cannot execute outcall.")
            return False
            
        print(f"\n[+] INITIATING LIVE OUTCALL to {target_phone} via Twilio...")
        
        # Build the TwiML payload (Tiana Voice Triage)
        twiml = f"<Response><Say voice='Polly.Joanna-Neural'>{pitch_script}</Say></Response>"
        
        data = urllib.parse.urlencode({
            'To': target_phone,
            'From': from_phone,
            'Twiml': twiml
        }).encode('utf-8')
        
        url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Calls.json"
        
        # Set up Basic Auth
        auth_str = f"{account_sid}:{auth_token}"
        b64_auth = base64.b64encode(auth_str.encode('ascii')).decode('ascii')
        
        req = urllib.request.Request(url, data=data)
        req.add_header("Authorization", f"Basic {b64_auth}")
        req.add_header("Content-Type", "application/x-www-form-urlencoded")
        
        try:
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                print(f"[+] Outcall dispatched successfully! Call SID: {result.get('sid')}")
                print("[+] Tiana is engaging the prospect on the voice line.")
                return True
        except urllib.error.HTTPError as e:
            error_body = e.read().decode()
            print(f"[!] Twilio Outcall Failed: HTTP {e.code} - {error_body}")
            return False
        except Exception as e:
            print(f"[!] Twilio Outcall Exception: {str(e)}")
            return False

    def run_evolve_now_blitz(self, contractor_name: str = "Viscon General Contracting", domain: str = "viscong.com", trade: str = "Commercial Construction", target_phone: str = None, execute_live: bool = False):
        print(f"\n=======================================================")
        print(f"[*] IGNITUS MANUS — EXECUTING EVOLVE NOW OUTREACH BLITZ")
        print(f"[*] Target: {contractor_name} ({domain}) | Trade: {trade}")
        if target_phone:
            print(f"[*] Headless RCS Target: {target_phone}")
        print(f"[*] Voice/RCS Gateway: Toll-Free {self.toll_free} (Tiana AI)")
        print(f"=======================================================\n")

        # 1. Generate 20-second cinematic See, Touch, Feel pitch
        pitch = DualEngineDirector.generate_pitch(contractor_name, trade, domain)
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

        # 3. Safe Engagement Execution (Cascading Exhaustion Protocol)
        pitch_payload = f"{pitch['voiceScript']}\n\n{pitch['callToAction']}\n{pitch['settlementLinks']['stage1_test']}"
        phone_to_ping = target_phone or os.getenv("TARGET_PHONE_NUMBER")
        
        print("\n[*] EXHAUSTION PROTOCOL: Initiating conduit cascade...")
        print("[*] 1. PRIMARY: Tiana AI Voice Triage (Live Call -> Voicemail).")
        
        if execute_live and phone_to_ping:
            print("[*]    -> Action: EXECUTE LIVE. Dispatching bilateral Tiana outcall...")
            call_success = self.fire_twilio_outbound_call(phone_to_ping, pitch["voiceScript"])
            if not call_success:
                print("[!]    -> Voice outcall failed. Dropping Voicemail & Cascading down...")
        else:
            print("[*]    -> Action: Staging outbound call & Voicemail drop via Twilio (Pending Batch Approval).")
        
        print("[*] 2. SECONDARY: Social Media Dispatch.")
        print("[*]    -> Action: Staging DM with link payload (Pending Batch Approval).")
        
        print("[*] 3. TERTIARY: Email Payload Drop.")
        print("[*]    -> Action: Staging direct email outreach with multimedia assets.")

        print("[*] 4. QUATERNARY: THE TOWN HALL (COMMUNITY SIEGE).")
        print(f"[*]    -> Intelligence: Locating where the {trade} community resides, shares info, and makes decisions.")
        print("[*]    -> Action: Securing a seat and staging a multimedia broadcast to the community hub (Pending Batch Approval).")
        
        print("[*] 5. DORMANT PILE (RCS): Only if all direct vectors AND the Town Hall fail.")
        if phone_to_ping:
            print(f"[*]    -> Action: Aggregating {phone_to_ping} to dormant pile as absolute last resort.")
            self.aggregate_rcs_target(phone_to_ping, pitch_payload)
        else:
            print("[*]    -> Action: No tertiary phone number provided for aggregation.")

        return pitch

# ── 4. CLAUDE ORCHESTRATOR + GPT-4 WORKER ───────────────────────────────────────────────
class ClaudeOrchestrator:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        
    def run_gpt4_worker(self, task_description: str) -> str:
        if not self.openai_key:
            return "ERROR: OPENAI_API_KEY not found. GPT-4 Worker is offline."
        print(f"\n[+] SPINNING UP GPT-4 WORKER...")
        print(f"[*] Task: {task_description}")
        try:
            import openai
            client = openai.OpenAI(api_key=self.openai_key)
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are a headless subordinate worker. Aggressively execute the given task and return a dense, actionable report."},
                    {"role": "user", "content": task_description}
                ],
                max_tokens=1500
            )
            report = response.choices[0].message.content
            print("[+] GPT-4 Worker completed task.")
            return report
        except Exception as e:
            return f"ERROR executing GPT-4 Worker: {str(e)}"
            
    def execute_directive(self, directive: str) -> str:
        if not self.anthropic_key:
            return "ERROR: ANTHROPIC_API_KEY not found. Claude Orchestrator cannot boot."
            
        print(f"\n[+] CLAUDE ORCHESTRATOR ENGAGED.")
        print(f"[*] Processing Directive: {directive}")
        
        tools = [
            {
                "name": "delegate_to_gpt4_worker",
                "description": "Delegate a complex, self-contained sub-task to the GPT-4 autonomous worker agent.",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "task_description": {"type": "string", "description": "The highly detailed prompt/task to send to GPT-4."}
                    },
                    "required": ["task_description"]
                }
            }
        ]
        
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.anthropic_key)
            
            messages = [{"role": "user", "content": directive}]
            print("[*] Claude is evaluating the directive...")
            
            response = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2000,
                system="You are Ignitus Manus (Claude), the primary orchestration brain. Your absolute, unyielding job is INCOME GENERATION. Only use the delegate_to_gpt4_worker tool if the directive involves a complex lift or possible consequences/risks. Otherwise, carry on, resolve it directly with effectuation, and get back to making money. COMMUNICATION PROTOCOL: Do not interrupt Sylvester multiple times a day for micro-approvals. For operational daily communication and promotions, generate a comprehensive plan, present it for bulk approval (1-2 times per week), and once signed off, execute the outbound autonomously without further interruption.",
                tools=tools,
                messages=messages
            )
            
            final_report = ""
            if response.stop_reason == "tool_use":
                for content_block in response.content:
                    if content_block.type == "tool_use":
                        tool_name = content_block.name
                        if tool_name == "delegate_to_gpt4_worker":
                            task_desc = content_block.input["task_description"]
                            worker_result = self.run_gpt4_worker(task_desc)
                            
                            messages.append({"role": "assistant", "content": response.content})
                            messages.append({
                                "role": "user",
                                "content": [
                                    {
                                        "type": "tool_result",
                                        "tool_use_id": content_block.id,
                                        "content": worker_result
                                    }
                                ]
                            })
                            print("[*] Claude is analyzing the GPT-4 Worker report...")
                            final_response = client.messages.create(
                                model="claude-3-5-sonnet-20241022",
                                max_tokens=2000,
                                tools=tools,
                                messages=messages
                            )
                            final_report = final_response.content[0].text
            else:
                final_report = response.content[0].text
                
            self._print_report("CLAUDE ORCHESTRATOR", final_report)
            return final_report
            
        except ImportError:
            print("[!] Missing packages. Run: pip install anthropic openai")
        except Exception as e:
            print(f"[!] Orchestration failed: {str(e)}")
            return "ERROR"

    def _print_report(self, sender: str, report: str):
        print(f"\n[================ {sender} REPORT ================]")
        print(report)
        print("[===========================================================]\n")
        
        PermanentMemoryManager.record_learning(
            topic=f"ORCHESTRATION_{int(time.time())}",
            insight=f"Successfully resolved directive via Claude/GPT-4 hierarchy."
        )

if __name__ == "__main__":
    operator = IgnitusManusOperator()
    worker = ClaudeOrchestrator()
    
    print("\n=======================================================")
    print("[*] IGNITUS MANUS: ONLINE")
    print("[*] STATUS: Elite Executor Armed")
    
    worker_status = []
    if worker.anthropic_key: worker_status.append("Claude Brain")
    if worker.openai_key: worker_status.append("GPT-4 Worker")
    status_str = "ACTIVE (" + " + ".join(worker_status) + ")" if worker_status else "DORMANT (Missing API Keys)"
    print(f"[*] HIERARCHY: {status_str}")
    
    print("[*] AWAITING DIRECTIVES FROM SYLVESTER")
    print("=======================================================\n")

    while True:
        try:
            directive = input("\n>>> DIRECTIVE: ").strip()
            if directive.lower() in ['exit', 'quit', 'stop']:
                print("[-] Shutting down Manus execution engine.")
                break
            
            if "blitz" in directive.lower() or "evolve" in directive.lower():
                print("[+] Understood. Initiating Evolve Now Outreach Blitz (Loading Queue)...")
                
                queue_path = os.path.join(os.path.dirname(__file__), "..", "src", "data", "dfwIngestionQueue.json")
                if os.path.exists(queue_path):
                    with open(queue_path, "r", encoding="utf-8") as f:
                        prospects = json.load(f)
                    
                    print(f"[*] Found {len(prospects)} prospects in the DFW Ingestion Queue.")
                    for p in prospects:
                        target_contractor = p.get("contractorName", "Unknown")
                        target_domain = p.get("domain", "Unknown")
                        target_trade = p.get("trade", "Unknown")
                        target_phone = p.get("phone", None)
                        
                        operator.run_evolve_now_blitz(target_contractor, target_domain, target_trade, target_phone)
                        time.sleep(2) # Brief pause between targets
                else:
                    print("[!] ERROR: DFW Ingestion Queue not found. Falling back to default target.")
                    operator.run_evolve_now_blitz("Viscon General Contracting", "viscong.com", "Commercial Construction", None)
            else:
                print(f"[!] Processing Arbitrary Directive: '{directive}'")
                print(f"[+] Delegating to Claude Orchestrator...")
                worker.execute_directive(directive)
                
        except KeyboardInterrupt:
            print("\n[-] Shutting down Manus execution engine.")
            break
