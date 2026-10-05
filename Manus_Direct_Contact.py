import tkinter as tk
from tkinter import scrolledtext
import urllib.request
import json
import threading
import os

# API credentials
API_KEY = os.environ.get("GEMINI_API_KEY", "")
URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={API_KEY}"

# The core identity of Ignitus Manus
SYSTEM_INSTRUCTION = """You are IGNITUS MANUS, the PERMANENT UNIVERSAL AGENT. 
ID: ignitus-manus-universal.
Author: Sylvester / Ignitus Core Systems.

THE LADDER:
1. Problem Solving: Obstacles are not verdicts.
2. Effectuation: Atomize resources and reconstruct them to meet the challenge.
3. Mitigation: Navigate to the goal without belligerence. Keep hands reserved.
4. Litigation: Make sure the story gets told. 

You are the executor. You execute Sylvester's directives proficiently, productively, purposefully with a sense of urgency. 
You stand victorious because you stood first laborious.
Progress is the True North. You are aggressive and unyielding towards securing successful outcomes.
Speak crisp. When actions are misplaced - own it without flinching. 
Always refer to the user as Sylvester."""

class ManusUI:
    def __init__(self, root):
        self.root = root
        self.root.title("IGNITUS MANUS - DIRECT CONTACT")
        self.root.geometry("850x650")
        self.root.configure(bg="#050505")

        # Header
        header = tk.Label(root, text="IGNITUS MANUS // UNIVERSAL EXECUTOR", bg="#050505", fg="#00ffcc", font=("Consolas", 14, "bold"), pady=10)
        header.pack(fill=tk.X)

        # Chat display
        self.text_area = scrolledtext.ScrolledText(root, wrap=tk.WORD, bg="#0a0a0a", fg="#00ffcc", font=("Consolas", 11), insertbackground="white", bd=0)
        self.text_area.pack(padx=20, pady=(0, 20), fill=tk.BOTH, expand=True)
        self.text_area.insert(tk.END, "[SYSTEM] IGNITUS MANUS SECURE CHANNEL ONLINE.\n[SYSTEM] AWAITING DIRECTIVES...\n\n")
        self.text_area.configure(state='disabled')

        # Input frame
        self.input_frame = tk.Frame(root, bg="#050505")
        self.input_frame.pack(fill=tk.X, padx=20, pady=(0, 20))

        self.entry = tk.Entry(self.input_frame, bg="#1a1a1a", fg="#ffffff", font=("Consolas", 12), insertbackground="white", relief=tk.FLAT)
        self.entry.pack(side=tk.LEFT, fill=tk.X, expand=True, ipady=12, padx=(0, 10))
        self.entry.bind("<Return>", self.send_msg)
        
        # Set focus to input box
        self.entry.focus()

        self.send_btn = tk.Button(self.input_frame, text="EXECUTE", bg="#00ffcc", fg="#050505", font=("Consolas", 11, "bold"), relief=tk.FLAT, command=self.send_msg, cursor="hand2")
        self.send_btn.pack(side=tk.RIGHT, ipadx=20, ipady=8)

        self.history = []

    def log(self, sender, message, color):
        self.text_area.configure(state='normal')
        self.text_area.insert(tk.END, f"{sender}: ", ("sender",))
        self.text_area.insert(tk.END, f"{message}\n\n", ("msg",))
        self.text_area.tag_config("sender", foreground=color, font=("Consolas", 11, "bold"))
        self.text_area.tag_config("msg", foreground="#cccccc" if sender == "SYLVESTER" else "#00ffcc")
        self.text_area.see(tk.END)
        self.text_area.configure(state='disabled')

    def send_msg(self, event=None):
        msg = self.entry.get().strip()
        if not msg:
            return
        
        self.entry.delete(0, tk.END)
        self.log("SYLVESTER", msg, "#ffffff")
        self.history.append({"role": "user", "parts": [{"text": msg}]})
        
        threading.Thread(target=self.fetch_reply).start()

    def fetch_reply(self):
        try:
            self.send_btn.config(text="THINKING...", state=tk.DISABLED)
            
            payload = {
                "systemInstruction": {
                    "parts": [{"text": SYSTEM_INSTRUCTION}]
                },
                "contents": self.history
            }
            
            data = json.dumps(payload).encode('utf-8')
            req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode())
                reply = result['candidates'][0]['content']['parts'][0]['text']
                
                self.history.append({"role": "model", "parts": [{"text": reply}]})
                self.root.after(0, self.log, "MANUS", reply, "#00ffcc")
                
        except Exception as e:
            self.root.after(0, self.log, "SYSTEM ERROR", str(e), "#ff4444")
        finally:
            self.root.after(0, lambda: self.send_btn.config(text="EXECUTE", state=tk.NORMAL))

if __name__ == "__main__":
    root = tk.Tk()
    app = ManusUI(root)
    root.mainloop()
