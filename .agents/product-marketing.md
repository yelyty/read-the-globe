# Product Marketing Context

**Document version:** v2
**Last updated:** 2026-11-25

> Auto-drafted from the codebase (README, landing copy in `messages/en.json`, `index.html` meta tags, About page). Lines marked **TBD** had no source in the repo and need input.

## Product Overview

**One-liner:** A reading log with a world map: every novel you log marks where its story is set and where its author comes from.
**What it does:** You log a book with its title, author, author's country and the places the story visits. The atlas marks the setting country in olive, the author's country in rust, and stripes a country that is both. Over years of reading it shows how much of the world your books have reached. Goals, a searchable shelf, CSV import/export and shareable postcards build on that map.
**Product category:** Reading tracker / reading log (shelf neighbours: Goodreads, StoryGraph). Sub-niche: "read around the world" trackers.
**Product type:** Consumer web app (B2C), React + Supabase, hosted on Netlify. Available in English, Czech and Ukrainian, with day and night themes.
**Business model:** Free. No card needed, no ads. Monetization: **TBD**.

## Target Audience

**Target users:** Readers of fiction, mostly novels, who care where their books come from. In particular, people doing a "read around the world" challenge and readers who want more diverse reading.
**Decision-makers:** The reader (B2C, single buyer).
**Primary use case:** Seeing and widening the geographic reach of your reading.
**Jobs to be done:**

- Show me how much of the world my reading has covered, and where the gaps are.
- Give me a goal to read toward (a region, a set of countries, a theme).
- Let me show friends where my books have taken me.
  **Use cases:**
- Logging the book on your nightstand in about a minute.
- Importing an existing reading list from CSV (for example from another tracker or a spreadsheet).
- Running a goal such as "Across Africa", "The Nordics", "Stories set in the Arctic".
- Sharing a postcard each December ("A year in books").

## Personas

B2C: no buying committee. Possible reader segments (**TBD**, to confirm):

| Segment                     | Cares about                      | Challenge                               | Value we promise                                |
| --------------------------- | -------------------------------- | --------------------------------------- | ----------------------------------------------- |
| Around-the-world challenger | Reaching every country           | Tracks it in a spreadsheet or by hand   | A map that fills in on its own, with goals      |
| Diverse-reading reader      | Reading beyond their own culture | Can't tell where their reading clusters | Two marks per book show setting vs. perspective |
| Social sharer               | Showing their reading            | Generic stats graphics                  | Postcards with stamps, ready for any app        |

## Problems & Pain Points

**Core problem:** Readers can't see where their reading actually comes from. Mainstream trackers count books and pages, not places.
**Why alternatives fall short:**

- General trackers don't map a book's setting or its author's country.
- Spreadsheets and paper maps for "read the world" challenges are manual and break easily.
- They also mix up "reading about a place" and "reading from a place".
  **What it costs them:** Time spent keeping a manual list, and a reading life that stays in a few countries without them noticing.
  **Emotional tension:** **TBD** (for example: feeling that your reading is narrow; streaks and leaderboards that create pressure).

## Competitive Landscape

**Direct:** Other "read around the world" trackers or challenge apps: **TBD**, names to confirm.
**Secondary:** Goodreads, StoryGraph. They track books and stats well, but they don't map setting and author country side by side.
**Indirect:** Spreadsheets, a paper map with pins, a reading-challenge blog post. They work at first but are manual, with no goals and no sharing.

## Differentiation

**Key differentiators:**

- Two marks per book: the setting (olive) and the author's country (rust), striped when both.
- The form previews which countries a book will mark before you save it.
- Goals by region, set of countries or theme, shown as a route to a flag.
- Postcards: sheets of stamps for authors, settings, or a year in books.
- Imagined worlds (Middle-earth, Earthsea, Narnia) get a place beyond the map.
- Handles real-world country problems: "England" finds the United Kingdom, and splits like Czechoslovakia ask which country it is today.
- Free, no ads, and your data is exportable at any time (CSV or full JSON backup).
  **How we do it differently:** The map is the only progress bar. There are no streaks and no leaderboard.
  **Why that's better:** It separates reading _about_ a place from reading _from_ it, and it keeps the motivation calm and personal.
  **Why customers choose us:** **TBD**, needs real user feedback.

## Objections

| Objection                                                  | Response                                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| "I already log my books elsewhere."                        | Import your list as a CSV. There's an example file to start from.                |
| "Typing every book by hand is too slow."                   | One minute per book, or a CSV import.                                            |
| "What about books set in several places, or nowhere real?" | List every country the story visits. Imagined worlds get a place beyond the map. |
| "What's the catch if it's free?"                           | No card, no ads, and you can export everything. (Long-term model **TBD**.)       |

**Anti-persona:** Readers who want social features, reviews, recommendations or reading streaks. Non-fiction-first readers, since the product is built around a story's setting (**TBD**, confirm).

## Switching Dynamics

**Push:** Manual spreadsheets and paper maps; trackers that only count books.
**Pull:** A map that fills in automatically, two marks per book, goals and postcards.
**Habit:** An existing history in Goodreads or StoryGraph, or an existing spreadsheet.
**Anxiety:** Re-entering old books; losing data. Answered by CSV import and export plus a full backup.

## Customer Language

**How they describe the problem:** **TBD**. No verbatim user quotes in the repo yet.
**How they describe us:** **TBD**.
**Words to use (from current copy):** atlas, map, pin, mark, countries, "where your books have taken you", story set here, author from here, postcard, stamps, route, shelf, goal, "read at your own pace".
**Words to avoid:** streaks, leaderboard, gamification, platform (**TBD**, confirm). Gendered references to the example reader: the landing says "example user / their".
**Glossary:**

| Term                                  | Meaning                                                              |
| ------------------------------------- | -------------------------------------------------------------------- |
| Atlas                                 | The user's world map of all logged books                             |
| Setting / "story set here"            | A country the story visits (olive)                                   |
| Author's country / "author from here" | The country the author calls home (rust)                             |
| Both                                  | Setting and author's country are the same (striped)                  |
| Goal                                  | A region, set of countries or theme to read toward, shown as a route |
| Shelf                                 | The searchable list of logged books                                  |
| Postcard                              | A shareable image: authors, settings, or a year in books             |

## Brand Voice

| Attribute              | Means                                                                     | Doesn't mean                       | Example line                                                                               |
| ---------------------- | ------------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| Literary-travel warmth | Travel and post metaphors (postcards, stamps, routes, "send a card home") | Twee or whimsical for its own sake | "Send a card home from wherever your reading has been."                                    |
| Plain and concrete     | Short sentences that say exactly what happens                             | Vague benefit claims               | "Log a novel and your atlas marks where the story is set and where its author calls home." |
| Calm, unpressured      | Reading at your own pace; the map is the only progress bar                | Hustle, streaks, competition       | "Read at your own pace. The map remembers every book."                                     |
| Honest and simple      | Free, no card, no ads, your data is yours                                 | Fine print and upsells             | "It's free. No card needed."                                                               |

**Tone by context:**

- Support: friendly and practical ("We usually reply within a few days.")
- Launch: **TBD**
- Errors: direct, says what to do next ("Write a few words first.")
- Sales/landing: question-led and evocative ("Where have your books taken you?")
- Social: **TBD**. Postcards are the main share asset.
  **Terms we own:** atlas, two marks, postcards / stamps, "where have your books taken you?"
  **Never use (and why):** streaks / leaderboard, which conflict with the "no pressure" stance on the About page. Also don't define the product by what it lacks ("no streaks, no leaderboard"): say what happens instead ("your atlas fills in at whatever pace you read"). Keep one plain "No card needed" next to the CTA.

## Proof Points

**Metrics:** **TBD**. No usage numbers in the repo.
**Customers:** **TBD**
**Testimonials:** **TBD**. The landing uses an example user (48 books, 44 of 195 countries), not a real person.
**Value themes:**

| Theme                         | Proof                                                   |
| ----------------------------- | ------------------------------------------------------- |
| See the world of your reading | Atlas with two marks per book                           |
| Read with a purpose           | Goals by region, country set or theme                   |
| Share it                      | Three postcard types, saved as pictures                 |
| Low effort, no lock-in        | About a minute per book, CSV import/export, JSON backup |
| Free                          | No card, no ads                                         |

## Goals

**Business goal:** **TBD** (for example, grow active readers).
**Conversion action:** Sign up / "Start your atlas", then log the first book.
**Current metrics:** **TBD**

## Learnings

_Decisions and tested lessons. Newest first. Keep it to about 20 active entries._

| Date       | Learning                                                                                                                                              | Evidence                                                     | Applies to                              | Status |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------- | ------ |
| 2026-11-25 | Don't say a book "marks two countries": a book set in several countries marks more. Say it marks where the story is set and where the author is from. | Copy review against the FAQ and first-run text               | Landing, meta tags, pins, social images | active |
| 2026-11-25 | The signup CTA is "Start your atlas" everywhere; the landing page uses "log" for the action, not "pin".                                               | Copy review: three button names and two verbs for one action | Landing, auth, ads, social              | active |

## Changelog

_Newest first. One line per revision: what changed and why._

- v2 (2026-11-25) — Copy review: fixed the "two countries" claim, one CTA name, voice rule against negation lists; tagline is now "A reading log with a world map."
- v1 (2026-11-25) — Initial context, auto-drafted from README, landing copy and About page.
