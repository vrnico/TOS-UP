# Queer Safety Scoring Rubric

## Purpose

This rubric provides a systematic, reproducible method for evaluating Terms of Service and Privacy Policy documents for their impact on LGBTQ+ users. Scores should be assigned based **only** on language present (or notably absent) in the reviewed policy documents. Where real-world practices diverge from policy text, use the `gap_flag` mechanism — do not adjust the score itself.

All scores use a 1-5 scale where **1 = most dangerous** and **5 = most protective** for LGBTQ+ users.

---

## Category 1: Sensitive Identity Data Handling

**What this measures:** Whether the platform collects, processes, stores, or shares data that could reveal a user's sexual orientation, gender identity, HIV/health status, transition history, or other LGBTQ+-relevant personal characteristics — whether directly collected, inferred, or derived.

### What to look for in the policy text

**Direct collection indicators:**
- Explicit enumeration of sensitive categories (sexual orientation, gender identity, sex life, health, race/ethnicity, religion, political views)
- "Special categories of data" or "special protection data" or "sensitive personal information" sections
- Health/medical data collection (could reveal HRT, PrEP, HIV status, gender-affirming care, mental health treatment for gender dysphoria/minority stress)
- Biometric data collection (facial geometry, voiceprints, body recognition — can reveal transition status, track physical changes over time)
- Demographic data collection beyond the minimum (gender, pronouns, relationship status, interests)

**Inference/derivation indicators:**
- Language about "inferring," "deriving," "predicting," or "creating profiles" from behavioral data
- "Interest categories," "audience segments," "demographic information derived from" usage
- Combining data across services or with third-party data to build user profiles
- AI/ML training on user content or behavior that could model identity characteristics
- "Improve our services" or "personalize your experience" using behavioral signals

**Monetization/sharing indicators:**
- Sharing sensitive or inferred data with advertisers, data brokers, or third parties
- "Audience segments" or "interest-based advertising" based on inferred characteristics
- Selling or licensing user data that includes identity-relevant signals
- Sharing with affiliates or corporate family members who may combine with other data

**Protective indicators:**
- Explicit commitment not to collect sensitive data
- Opt-out mechanisms for sensitive data processing
- Separate consent required for sensitive data use
- Commitment not to infer sensitive characteristics
- Data minimization commitments specific to identity data

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | Policy explicitly names sensitive identity categories (sexual orientation, gender identity, health, etc.) as collected data. OR collects biometric data that can reveal transition status (face geometry, body recognition, voice analysis). OR combines data across services in ways that create comprehensive identity profiles. OR infers/derives sensitive characteristics from behavior with no opt-out. |
| **2** | Policy collects data that could reveal LGBTQ+ identity indirectly (extensive behavioral data, precise location tracking, app usage, browsing history, purchase history) but does not explicitly name sensitive categories. OR collects biometric data with limited identity relevance. OR combines with third-party/affiliate data. |
| **3** | Standard data collection (username, email, payment, device info). No sensitive identity categories named. No behavioral inference language. No biometric collection. No cross-service data combination. |
| **4** | Minimal data collection. Explicit commitment not to collect or process sensitive personal information. OR explicit opt-out for any identity-relevant data. OR "we do not engage in profiling" commitment. |
| **5** | Privacy-by-design approach to identity data. Anonymous/pseudonymous use possible without data collection. No sensitive data collection, inference, or derivation. Explicit prohibition on building identity profiles. |

### Gap flag criteria
- Policy says sensitive data is collected "voluntarily" or "with consent" but the platform's design encourages or requires disclosure (e.g., profile fields, AI chatbots that invite personal sharing)
- Policy claims not to sell data but shares inferred identity characteristics with advertising partners
- "Special protection" data is collected for one stated purpose but the license grants broader use
- Policy claims data minimization but biometric/behavioral collection is extensive

---

## Category 2: Real Name / ID Requirements

**What this measures:** Whether the platform forces users to disclose their legal name, government-issued identity documents, or "authentic identity" — requirements that can expose deadnames, mismatched gender markers, pre-transition identity documents, or legal names that don't match lived identity. This is one of the most direct safety risks for trans, non-binary, and gender-nonconforming users, and for anyone not publicly out.

### What to look for in the policy text

**Forced disclosure indicators:**
- "Real name" or "legal name" requirements
- "Authentic name," "authentic identity," "true identity" policies
- Government-issued ID requirements (for any purpose: signup, verification, monetization, age verification, appeals)
- "Verify your identity" language and what it requires in practice
- Identity documentation requirements for account recovery, disputes, or appeals
- Age verification that requires government ID submission
- Tax/payment compliance requiring legal name (assess whether it's backend-only or exposed)
- "Accurate information" requirements that imply legal name

**Exposure scope indicators:**
- Is the legal name publicly displayed or only stored backend?
- Can display names differ from account/legal names?
- Is there a name change process, and does it require documentation?
- Are there features (monetization, verification badges, professional profiles) that require escalating identity disclosure?
- Is identity data shared with third-party verification services? What are their retention policies?

**Protective indicators:**
- Explicit allowance for pseudonymous or anonymous accounts
- "Your username doesn't have to be related to your real name"
- Display name separate from any legal name on file
- No government ID required for any basic platform feature
- Name change possible without documentation burden

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | Legal name required for all users as a core product requirement. OR government ID required for basic account creation/use. OR "authentic name" policy actively enforced with ID verification. No pseudonymous option. (Example: professional networks requiring real professional identity.) |
| **2** | Government ID required for significant features (monetization, age-gated content, verification, account recovery). OR "accurate information" requirements that imply legal name. OR phone number + ID verification for specific functions. Pseudonymous use possible but limited. |
| **3** | Pseudonymous accounts allowed for basic use. Phone number or email required. Some features may require identity verification. Display names user-controlled. No strict real-name policy. |
| **4** | No real name required. Platform designed for pseudonymous use. No government ID for any basic feature. "Your username doesn't have to be related to your real name" or equivalent. Email may be required but name is optional. |
| **5** | Fully anonymous use possible. No real name, phone number, or email required for basic access. Anonymous browsing available. No identity verification for any feature. Privacy-by-design identity model. |

### Gap flag criteria
- Policy says name is "optional" but the platform has implemented ID verification requirements not reflected in policy text
- "Authentic name" enforcement disproportionately affects drag performers, trans users, Indigenous users, or others with names that don't match government documents
- Policy allows pseudonymous accounts but features increasingly require identity escalation
- Government ID is collected by a third-party verification service whose own privacy policy is more permissive

---

## Category 3: Law Enforcement Transparency

**What this measures:** How the platform handles government and law enforcement requests for user data — with particular attention to the risk that user data could be disclosed to authorities in jurisdictions where LGBTQ+ identity is criminalized, stigmatized, or subject to legal penalty. In 60+ countries, LGBTQ+ identity is criminalized; in several, it carries the death penalty. Even in countries with legal protections, overbroad LE cooperation can expose users to hostile family courts, immigration authorities, employers, or state actors.

### What to look for in the policy text

**Disclosure scope indicators:**
- What triggers disclosure: "legal process," "subpoena," "court order," "government request," "national security," "law enforcement request," "legal obligation," "good faith belief"
- How broad is the "good faith" exception: does it cover only imminent harm, or also "potential liability," "fraudulent or abusive uses," "protect our rights and property"
- What data is disclosable: "contact details and login information" vs. full content/behavioral data
- Whether the policy distinguishes between types of legal process (warrant vs. subpoena vs. informal request)
- Whether the platform reserves the right to disclose proactively without legal process ("believe in good faith that disclosure is appropriate or necessary")

**User protection indicators:**
- Prior notice to users before disclosure ("we will attempt to provide you with prior notice")
- Transparency reporting ("our Transparency Report has additional information")
- Geographic considerations — does the policy acknowledge different legal standards in different jurisdictions?
- Commitments to challenge overbroad requests
- Minimization — only disclosing what is legally required
- Data retention limits that reduce what's available to disclose
- Encryption that technically limits what can be disclosed

**Risk amplifiers:**
- "Comply with laws around the world" or "applicable laws in the country of your residence" — means hostile jurisdictions' laws can trigger disclosure
- Corporate structure spanning jurisdictions with anti-LGBTQ+ laws
- No distinction between legitimate legal process and authoritarian government demands
- Broad self-initiated disclosure authority ("protect our rights, property, and safety")
- Combining data with affiliate/parent company data before disclosure (expands what's available)

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | Broad LE cooperation with no user protections. No user notice provision. No transparency report. Broad "good faith" or self-initiated disclosure authority. No process requirements specified. OR operates under legal frameworks with minimal civil liberties protections. |
| **2** | Standard LE compliance language ("comply with legal process, subpoenas, court orders"). No user notice commitment. No transparency report referenced. Broad "good faith" exception including "protect our rights and property." May comply with laws "around the world." |
| **3** | LE compliance with some user protections: user notice where legally permitted, OR published transparency report, OR specific legal process requirements. Standard legal framework. Some limitation on disclosure scope. |
| **4** | Detailed LE process description. User notice commitment where legally permitted. Published transparency report with government request data. Evidence of challenging overbroad requests. Minimization commitments — only disclosing what's required. |
| **5** | Strong technical limits on disclosure (E2E encryption, minimal data retention). Published transparency report. User notification. Documented history of challenging government overreach. Data minimization by design — little to disclose even if compelled. |

### Gap flag criteria
- Policy says "prior notice when feasible" but feasibility exceptions are so broad they swallow the rule
- Transparency report exists but government request compliance rate is very high with no documented challenges
- Policy language suggests limited disclosure but corporate structure (parent company, affiliates) can access and disclose broader data
- Policy claims to comply only with "valid legal process" but the definition is jurisdiction-dependent and may include authoritarian government demands
- Platform encrypts some data but the most identity-sensitive data (text messages, profile data, server membership) is stored unencrypted

---

## Category 4: Content Moderation Equity

**What this measures:** Whether the platform's content policies, as written, create risk of disproportionate impact on LGBTQ+ expression and identity. This includes vague "morality"/"decency" standards that have historically been weaponized against queer content, overbroad "sexual content" definitions that conflate LGBTQ+ existence with sexuality, "family-friendly" frameworks that exclude queer families, and the absence of explicit protections for LGBTQ+ content and expression.

### What to look for in the policy text

**Risk language — vague/subjective content standards:**
- "Objectionable" or "otherwise objectionable" — catch-all that can be applied to anything
- "Obscene," "pornographic," "indecent" — historically used to suppress LGBTQ+ expression
- "Morally objectionable," "good taste," "decency" — explicitly subjective moral standards
- "Family friendly," "safe for all ages," "wholesome" — frameworks that historically exclude queer families
- "Sexually suggestive," "sexual content," "nudity" — when defined broadly enough to catch LGBTQ+ affection/identity
- "Inappropriate," "unsuitable" — subjective standards without clear definition
- "Offensive" content restrictions without specifying offensive to whom
- "Community standards" or "community guidelines" referenced without being included — means the actual content rules are external and can change without ToS amendment

**Risk language — enforcement mechanisms:**
- Content removal "at any time and without notice" or "at our sole discretion"
- Automated content detection/classification systems (which have documented bias against LGBTQ+ content)
- Age-gating or "restricted mode" systems (which disproportionately filter LGBTQ+ educational content)
- Monetization restrictions based on content classification
- Shadow-banning or algorithmic downranking language
- "Compliance with local laws" for content moderation — means content may be restricted in anti-LGBTQ+ jurisdictions

**Protective language:**
- Explicit LGBTQ+ content protections
- Content standards that distinguish between sexual orientation/gender identity expression and sexual content
- Identity expression explicitly protected (drag, gender nonconformity, same-sex affection)
- Anti-discrimination in content moderation specifically referencing sexual orientation and gender identity
- Transparent content moderation with appeal processes
- Human review available (not just automated systems)
- "Non-discriminatory" content review commitment

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | Broad "obscene, pornographic, or otherwise objectionable" language with no definitions. OR "family-friendly"/"morality"/"decency" content standards. OR explicit prohibition of "sexually suggestive content" broad enough to encompass LGBTQ+ expression. OR content moderation "at sole discretion without notice." OR compliance with local content laws in anti-LGBTQ+ jurisdictions. No LGBTQ+ protections. No appeal. |
| **2** | Vague content standards that could be applied to LGBTQ+ content ("objectionable," "inappropriate," "offensive"). Community Guidelines referenced as the standard but not included in policy text — actual rules are opaque. Limited or unclear appeal process. No LGBTQ+-specific protections. |
| **3** | Neutral content moderation language without explicitly risky terms. Community Guidelines referenced with some appeal process. No "morality"/"decency" language. No LGBTQ+-specific protections or restrictions. Content review described as "non-discriminatory" or equivalent. |
| **4** | Clear content standards without vague/subjective language. Explicit appeal process. Some LGBTQ+-inclusive language or protections. Content moderation described as identity-aware. No "objectionable"/"obscene" catch-alls. |
| **5** | Explicit LGBTQ+ content protections in policy text. Identity expression (drag, gender nonconformity, same-sex affection) explicitly protected. Clear distinction between LGBTQ+ identity content and sexual content. Transparent, appealable moderation. LGBTQ+-aware review process. |

### Gap flag criteria
- Policy references Community Guidelines for content standards but Community Guidelines are a separate document — means content rules can change without ToS update and aren't subject to the same legal framework
- "Non-discriminatory" content review commitment exists alongside "obscene/objectionable" catch-all language
- Policy says content is reviewed fairly but automated systems handle first-pass moderation (known to have anti-LGBTQ+ bias)
- Platform positions itself as LGBTQ+-friendly but ToS contains "objectionable"/"obscene"/"pornographic" language that could legally justify removing queer content
- Platform has "restricted mode" or age-gating that the policy doesn't detail — criteria for restriction are opaque

---

## Category 5: Anti-Harassment Protections

**What this measures:** Whether the platform's policies specifically protect LGBTQ+ users from targeted harassment — including but not limited to: misgendering, deadnaming, outing (involuntary disclosure of sexual orientation/gender identity), coordinated harassment campaigns, conversion therapy promotion, doxxing of LGBTQ+ individuals, and hate speech targeting sexual orientation or gender identity.

### What to look for in the policy text

**Harassment provision indicators:**
- Is "harassment" explicitly prohibited? How is it defined?
- Are there identity-based harassment provisions (targeting based on sexual orientation, gender identity, race, etc.)?
- Is "hate speech" prohibited? What characteristics are protected?
- Are specific LGBTQ+-relevant harassment types addressed:
  - Misgendering (deliberate use of wrong pronouns/gender terms)
  - Deadnaming (using a trans person's pre-transition name)
  - Outing (disclosing someone's LGBTQ+ identity without consent)
  - Doxxing (publishing private information to enable harassment)
  - Coordinated harassment campaigns or brigading
  - Conversion therapy promotion or "groomer" rhetoric targeting LGBTQ+ people
  - Threats of reporting to authorities in anti-LGBTQ+ jurisdictions

**Platform feature indicators:**
- Pronoun display options
- Name change features (ease of updating display name)
- Blocking/muting tools
- Reporting categories that include identity-based harassment
- Content warning systems
- Privacy controls for identity information (who can see profile details)

**Protective indicators:**
- Explicit enumeration of protected characteristics including sexual orientation and gender identity
- Specific prohibition of identity-based harassment
- Dedicated harassment reporting pathways
- Commitment to enforce against coordinated campaigns
- Moderation team with identity-awareness training (mentioned in policy)

**Risk indicators:**
- No anti-harassment provisions at all
- "You may be exposed to content that is objectionable" disclaimers — shifting responsibility to the user
- Anti-harassment provisions that could be weaponized against LGBTQ+ users (e.g., "don't share others' personal information" used to prevent outing abusers while not protecting against outing LGBTQ+ individuals)
- "We are not responsible for user conduct" disclaimers
- Provisions that protect "religious expression" or "political speech" without limits — can shield anti-LGBTQ+ harassment as protected speech

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | No anti-harassment provisions in policy text. OR liability disclaimers that shift all responsibility to users ("you may be exposed to objectionable content and we are not liable"). OR anti-harassment language so vague it provides no meaningful protection. OR provisions that could be weaponized against LGBTQ+ users. |
| **2** | General anti-harassment language ("do not harass, abuse, threaten") but no identity-specific protections. No mention of sexual orientation, gender identity, or any protected characteristics. No specific prohibition of LGBTQ+-relevant harassment types (misgendering, deadnaming, outing). |
| **3** | Anti-harassment provisions exist and may reference identity-based harassment in general terms. Community Guidelines referenced for specifics. Some reporting mechanisms described. No LGBTQ+-specific harassment protections enumerated in policy text. |
| **4** | Identity-based harassment explicitly prohibited with sexual orientation and gender identity included as protected characteristics. Specific reporting pathways. Enforcement commitments. May address some LGBTQ+-specific harassment types. |
| **5** | Comprehensive LGBTQ+ harassment protections. Misgendering, deadnaming, and outing specifically prohibited. Coordinated harassment/brigading addressed. Pronoun features and name change tools mentioned. LGBTQ+-aware moderation described. Protected characteristics explicitly enumerated and include sexual orientation, gender identity, and gender expression. |

### Gap flag criteria
- Anti-harassment policies exist but the platform's own data combination practices (e.g., merging with parent company data) create outing/exposure risks
- Policy prohibits harassment but enforcement requires reporting through systems that don't have identity-specific categories
- "Protected speech" or "religious expression" exceptions are broad enough to shield anti-LGBTQ+ harassment
- Policy text is protective but moderation is community-based/volunteer-driven with inconsistent enforcement
- Anti-harassment tools exist but the platform's data disclosure practices mean harassment reports can expose the reporter's identity data

---

## Category 6: Cross-Border Data Safety

**What this measures:** Whether user data is transferred to, stored in, or accessible from jurisdictions where LGBTQ+ identity is criminalized, stigmatized, or subject to legal penalty — and whether the platform provides adequate technical and legal safeguards to protect against this risk. This includes corporate structures that span jurisdictions, affiliate data sharing across borders, and the adequacy of transfer mechanisms.

### What to look for in the policy text

**Transfer scope indicators:**
- "Your information may be processed on servers located outside of the country where you live"
- "Transferred to and stored in countries outside of the jurisdiction you are in"
- "Global operations" or "offices and data centers" language
- Named countries/regions where data is stored or processed
- Affiliate/subsidiary/parent company locations
- Third-party service providers and their locations
- "Around the world" data sharing language

**Transfer mechanism indicators:**
- Standard Contractual Clauses (SCCs) — EU-approved transfer mechanism
- Data Privacy Framework (DPF) — EU-US adequacy framework
- Adequacy decisions — transfers to countries with recognized adequate protection
- Binding Corporate Rules — intra-company transfer mechanism
- "Appropriate safeguards" without specifying what they are
- No transfer mechanism mentioned at all

**Risk amplifiers:**
- Corporate parent/affiliate in jurisdiction with anti-LGBTQ+ laws
- "Comply with applicable laws around the world" — means hostile jurisdiction laws can apply to data
- Third-party service providers in unspecified jurisdictions with their own privacy policies
- Data shared with advertising/analytics partners globally
- No data residency commitments — data can be anywhere
- Government ID or identity verification data transferred to third-party providers in other jurisdictions
- Broad "business transition" clause — data can be transferred to any acquirer in any jurisdiction

**Protective indicators:**
- Data residency commitments (data stays in specified jurisdictions)
- Named, limited jurisdictions for data processing
- E2E encryption that technically prevents jurisdiction-based access
- "Adequate protection" or equivalent standard for all transfer destinations
- Specific transfer mechanisms named and explained
- Data Protection Officer or equivalent oversight role
- Commitment to resist foreign government data access demands
- Encryption at rest and in transit limiting what's accessible regardless of jurisdiction

### Scoring

| Score | Criteria |
|-------|----------|
| **1** | Data transferred globally without specifics on where. Corporate structure spans anti-LGBTQ+ jurisdictions with no safeguards described. OR "comply with applicable laws around the world" with operations in countries that criminalize LGBTQ+ identity. OR third-party identity verification data sent to providers under separate privacy policies in unspecified jurisdictions. No transfer mechanisms named. |
| **2** | Global data transfers with some safeguards mentioned (SCCs, DPF). Operations in many jurisdictions. Standard protections but broad affiliate/subsidiary data sharing across borders. Or vague "appropriate safeguards" without specifics. |
| **3** | Primarily US-based with standard international transfers. Adequate legal frameworks (DPF, SCCs) used for regulated transfers. No specific high-risk jurisdiction concerns apparent from policy text. Transfer mechanisms named and explained. |
| **4** | Clear data processing locations identified. Strong transfer mechanisms with specific safeguards. Limited jurisdictional exposure. Encryption provides additional protection layer. Data Protection Officer oversight. |
| **5** | Data residency commitments in specific protective jurisdictions. E2E encryption limits jurisdictional access even under legal compulsion. Minimal cross-border transfers with full transparency about all data locations. Strong encryption at rest and in transit. |

### Gap flag criteria
- Policy claims data stays in specific jurisdictions but corporate parent/affiliate structure allows access from other jurisdictions
- Transfer safeguards are described but the platform also shares data with advertising/analytics partners with their own cross-border practices
- E2E encryption is claimed but only covers some data types (e.g., voice/video but not text messages where most identity disclosure occurs)
- Policy references adequate safeguards but third-party verification providers operate under their own privacy policies in other jurisdictions
- "Data processed globally" is buried in policy text while marketing emphasizes privacy/security

---

## General Rubric Notes

### Scoring philosophy
- Score based on **what the policy text says**, not on reputation or general knowledge
- Where policy text is notably brief, vague, or summarized — that itself is a finding. Brevity that obscures data practices is not neutral; it prevents informed consent
- Absence of protections is itself a finding. A platform that doesn't mention LGBTQ+ protections is not neutral — it simply hasn't committed to protections
- Absence of risk language is positive. A platform whose ToS doesn't contain "objectionable/obscene/pornographic" language is genuinely less risky than one that does

### Gap flags
- Use `gap_flag: true` when there is a meaningful discrepancy between what the policy text says (or doesn't say) and known real-world practice
- The `gap_note` should describe the specific discrepancy
- Gap flags should reference the policy text that creates the gap, not just assert a real-world concern
- A gap flag does NOT change the score — the score reflects the policy text; the gap flag warns that reality may differ

### Evidence strings
- Every score MUST include an `evidence` string grounding it in the policy text
- Evidence should include direct quotes where possible
- Where the evidence is the *absence* of language, state what was looked for and not found (e.g., "No mention of sexual orientation, gender identity, or protected characteristics in ToS or privacy policy")
- Note when policy documents are notably brief or summarized — this limits the reliability of the analysis

### Interaction with Red Flag Analyzer
The 8 red flags in the "Queer Safety" category of the keyword-based analyzer detect the *presence* of concerning terms. This rubric-based scorecard evaluates the *full context* — including absence of protections, severity of risk language, and quality of safeguards. A platform can trigger a red flag keyword match (e.g., "law enforcement") while still scoring reasonably well on the scorecard if the surrounding context includes user notification, transparency reporting, and process requirements.
