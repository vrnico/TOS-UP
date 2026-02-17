# TOS-Up

**Wikipedia for Terms of Service. Rotten Tomatoes for Big Tech.**

TOS Up is a community-driven app that breaks down Terms of Service and Privacy Policies into plain language so regular people can actually understand what they're agreeing to. Built on Supabase.

---

## Want to Contribute?

We're building this together (you know who you are 😏). Here's how to get involved:

### 1. Get Added as a Collaborator

- DM **neek** 
- Send your **GitHub username** and or the **email tied to your GitHub account**
- You'll get a collaborator invite to the repo -- accept it

### 2. Clone the Repo

```bash
git clone https://github.com/vrnico/TOS-UP.git
cd TOS-SparkNotes
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
