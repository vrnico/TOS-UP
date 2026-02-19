# TOS SparkNotes — Exhaustive Scoring Rubric v2

## Philosophy
Score each category against a "what a reasonable user would expect" benchmark. 
Penalize ambiguity, hidden clauses, and deceptive formatting. 
Explicitly look for "rights grabs" where the platform takes more power than necessary for the service.

## Scoring Scale (1-5)
- **5: User-Centric.** Transparent, protective, narrow in scope. Follows "Privacy by Design."
- **4: Above Average.** Mostly transparent, minor overreach, good controls.
- **3: Industry Standard.** Typical legalese, broad but standard licenses, common tracking.
- **2: Below Average.** Notable overreach, vague language, limited user control, aggressive tracking.
- **1: User-Hostile.** Maximum rights grab, opaque processes, invasive surveillance, deceptive "summaries."

---

## Detailed Categories & Criteria

### 1. Content License Scope
**Goal:** Does the platform own your creativity?
- **5:** License is limited ONLY to what is necessary to provide the service. Fully revocable upon deletion. No sublicensing to third parties.
- **3:** Standard "worldwide, non-exclusive, royalty-free, sublicensable" license. Common for social media but broad.
- **1:** Perpetual, irrevocable, transferable license "in all media now known or hereafter developed." Platform can use your content for anything forever, even after you leave.

### 2. AI/ML Training Rights
**Goal:** Is your data being used to build their AI without consent?
- **5:** Explicit "Opt-In" required for AI training. Or a clear statement that they NEVER train on user content.
- **3:** Transparent about AI training but no opt-out available.
- **1:** Explicitly trains on all user content (including private content/DMs if applicable) with no opt-out, or hides AI training under broad "service improvement" clauses.

### 3. Data Collection Breadth (The "Invasiveness" Score)
**Goal:** How much of your life do they track?
- **5:** Minimal collection. Only what’s strictly necessary (email, username). No biometrics, no location, no contact scraping.
- **3:** Standard tracking: device info, IP, cookies, approximate location.
- **1:** Massive surveillance: Biometrics (faceprints, voiceprints), keystroke patterns, clipboard access, precise GPS, contact list scraping, browsing history beyond the app.

### 4. Third-Party Data Sharing & "Selling"
**Goal:** Who else gets your data?
- **5:** No sharing for advertising. Explicit "We do not sell." Sharing limited to essential service providers (e.g., Stripe for payments).
- **3:** Shares with ad/analytics partners. Says "We don't sell" but shares enough for targeting.
- **1:** Extensive sharing across a corporate conglomerate (e.g., Meta/Amazon ecosystem) and with data brokers. No meaningful opt-outs.

### 5. Dispute Resolution & Legal Rights
**Goal:** Can you sue them if they break the law?
- **5:** Full access to courts. No mandatory arbitration. No class action waiver. User's local jurisdiction.
- **3:** Mandatory arbitration but with a 30-day "Opt-Out" window. Class action waiver present.
- **1:** Forced arbitration with no opt-out. Class action waiver. Extremely short statute of limitations (e.g., 6 months to bring a claim). Venue in a distant, platform-favorable location.

### 6. Account Termination & Appeals
**Goal:** Can they ban you for no reason?
- **5:** Termination only for specific, documented violations. Notice provided. Human-led appeal process.
- **3:** Termination "at sole discretion" but notice is usually provided. Basic appeal mechanism exists.
- **1:** "Without notice, for any or no reason, at our sole discretion." No appeal process. You lose all your data/access instantly with no recourse.

### 7. Readability & The "Honesty Gap"
**Goal:** Does the "Easy Summary" match the "Legal Reality"?
- **5:** Plain language throughout. Summaries are accurate and don't hide aggressive terms.
- **3:** Standard legal complexity. Some marketing-speak, but generally honest.
- **1:** "Shadow Terms": Friendly summaries that actively mislead users about the aggressive legal reality (e.g., "We love your privacy!" while the legal text allows for biometric tracking).

### 8. Novel Problem Detection (Open-Ended)
**Instructions for the LLM:**
Look for "Easter Eggs" or high-risk clauses that aren't in these categories. Examples:
- "Liquidated Damages" clauses (e.g., you owe us $15k if you scrape us).
- Rights to your "Likeness" or "Voice" for AI avatars.
- Mandatory "Identity Verification" that requires government IDs for basic use.
- Clauses where they take a cut of your earnings even off-platform.
- "Moral Rights" waivers.
- Requirements to indemnify the platform for their OWN mistakes.
