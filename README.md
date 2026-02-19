# TOS SparkNotes

**Wikipedia for Terms of Service. Rotten Tomatoes for Big Tech.**

TOS SparkNotes is a community-driven app that breaks down Terms of Service and Privacy Policies into plain language so regular people can actually understand what they're agreeing to. Built on Supabase.

---

## Want to Contribute?

We're building this together. Here's how to get involved:

### 1. Get Added as a Collaborator

- DM **neek** on Discord (or wherever you found this project)
- Send your **GitHub username** or the **email tied to your GitHub account**
- You'll get a collaborator invite to the repo -- accept it

### 2. Clone the Repo

```bash
git clone https://github.com/vrnico/TOS-UP.git
cd TOS-UP
```

### 3. Make Your Own Branch

Never work directly on `main`. Create a branch with your name or a short descriptor:

```bash
git checkout -b yourname/braindump
```

### 4. Write Your Brain Dump

Create a file called `braindump.md` in the root of the project:

```bash
touch braindump.md
```

Open it up and just start writing. Don't overthink it. Here's a quick markdown cheat sheet to get you going:

#### Markdown Basics

```markdown
# Big Heading
## Smaller Heading
### Even Smaller

Regular paragraph text. Just type.

**Bold text** for emphasis.
*Italic text* for softer emphasis.

- Bullet point
- Another bullet
  - Nested bullet

1. Numbered list
2. Second item

> Blockquote -- good for calling out ideas

`inline code` for technical terms

[Link text](https://example.com)
```

### 5. What to Put in Your Brain Dump

The whole point is to get your raw thoughts down. We're figuring out what this app should be. Think about any or all of the following:

#### The Big Picture
- How should we present TOS/privacy policy breakdowns? Summaries? Ratings? Red flags?
- What's the "Rotten Tomatoes score" equivalent for a TOS? How do we rate how user-friendly (or hostile) a policy is?
- Should companies get letter grades? Numeric scores? Vibes-based ratings?

#### Features & Functionality
- What companies/services should we cover first?
- How do we handle TOS updates when companies change their policies?
- Should users be able to submit TOS docs for analysis?
- Do we want a comparison tool (e.g. Zoom vs Google Meet privacy policies)?
- Search and filtering -- how should users find what they're looking for?

#### Supabase & Data
- What tables do we need? Companies, policies, flags, scores, articles?
- Auth -- do users need accounts? What for?
- Do we want a community/voting layer (upvote the most important red flags)?

#### UI/UX
- What should the homepage feel like? Library browse? Search-first?
- How do we make dense legal text actually readable and maybe even fun?
- Mobile-first or desktop-first?

#### Content & Tone
- How snarky vs. serious should the breakdowns be?
- Do we want an editorial voice or keep it neutral wiki-style?
- Should there be a "learn" section that explains common legal jargon?

#### Anything Else
- Stuff that excites you about this project
- Stuff that worries you
- Features you've seen on other sites that we should steal
- Hot takes welcome

### 6. Push Your Branch

```bash
git add braindump.md
git commit -m "add braindump"
git push -u origin yourname/braindump
```

That's it. No PR needed for braindumps -- just push your branch and we'll read through them together.

---

## ELO Battle Arena (Pokemon-Style TOS Rankings)

Every company's Terms of Service gets scored across multiple dimensions -- privacy, creator rights, transparency, safety, and accountability. The **ELO Battle Arena** pits companies against each other head-to-head, Pokemon-style:

- **Type advantages matter.** Each matchup randomly selects a battlefield dimension. A company that's strong in Privacy can beat one with a higher overall score if the battle lands on a Privacy field. No company is universally best -- it depends on what you're measuring.
- **Color = type profile.** Each company gets an RGB color blended from its type scores. Blue-ish means privacy-focused. Green-ish means creator-friendly. Purple means safety-strong. You can read a company's priorities at a glance.
- **ELO rankings shift after every battle.** Win streaks push companies up the leaderboard. Upsets cause big swings. The system rewards consistency across dimensions, not just raw scores.
- **22 scoring dimensions** across TOS and Privacy Policies, from AI/ML training rights and content licensing to anti-harassment protections and cross-border data safety.

Platforms currently scored: TikTok, Instagram/Meta, Discord, Reddit, YouTube, Twitch, X/Twitter, Snapchat, LinkedIn, Kick, Substack, and Patreon.

---

## Project Structure (So Far)

```
app/            --> Original prototype (HTML/CSS/JS)
public/         --> Frontend (components, pages, routing)
server/         --> Backend (Express routes, Supabase, analyzer)
```

## Tech Stack

- **Frontend:** Vanilla JS, component-based architecture
- **Backend:** Node.js / Express
- **Database:** Supabase (Postgres)
- **Analysis:** TOS parsing and flag detection

---

## Questions?

DM neek. That's it. Let's build this thing.
