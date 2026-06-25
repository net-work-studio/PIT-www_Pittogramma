# Pittogramma

Pittogramma is a cultural platform covering graphic design, visual culture, events, journal content, and related resources.

## Language

**Upcoming (events)**:
Events that have not yet ended. Includes events scheduled for the future and events currently in progress.
_Avoid_: Next, future (in user-facing copy)

**Past (events)**:
Events that have ended.

**Event type**:
The format of an event: Talk, Workshop, 5+1, or a generic Event. Shown as an outline badge on cards and event pages (TALK, WORKSHOP, 5+1, EVENT).
_Avoid_: Tag, category, tipologia (in code — use "type")

**Event card location byline**:
Short line under the event title on listing cards. Physical events: `at {locationName}` (e.g. "at Cruo Studio"). Online events: `online` only.
_Avoid_: "At" (capitalised), "Online" (capitalised), showing address on cards

**Attendance mode**:
Whether an event is held in person (`offline`) or remotely (`online`). Drives card byline, detail location display, and structured data. When online, location name and address are hidden in Studio.
_Avoid_: format, venue type, isOnline

**Page intro (`introText`)**:
Short description shown under a section page title (e.g. Journal, Projects, Events). Edited on each page singleton in Studio; required, max 170 characters. On pages with a featured hero, the intro appears below the hero.
_Avoid_: description, subtitle (in CMS field names — use `introText`)

**Page title**:
The fixed heading shown at the top of a section index page (Projects, Events, About, etc.). Set once per page in Sanity; not editable by editors.
_Avoid_: Hero headline, SEO title (those can differ via the SEO module)

**Intro text**:
Optional subtitle under a page title on listing pages. A short editorial line that frames the section before its content grid.
_Avoid_: Description, excerpt, lead paragraph

**About page**:
The editorial page describing Pittogramma. Shows a page title only — no intro text. The opening copy lives in the main content body, not as a separate subtitle field.
_Avoid_: Info page (routing label only, not a content type)

**Place**:
A geographic location stored as its own document (city, country, coordinates). Referenced by studios, type foundries, designers, and other resources.
_Avoid_: Location (as a document type — "location" is fine in user-facing copy for events)

**Studio / Agency**:
A creative business listed under Studios & Agencies. Both are the same document type (`studio`); the distinction is editorial (category), not structural.
_Avoid_: Firm, company (in user-facing copy unless quoting a name)

**Map popup listing**:
When a map pin links to multiple entities at one Place (studios, designers, foundries, etc.), each name is shown on its own line under the section label — not comma-joined.
_Avoid_: Comma-separated entity lists in map popups

**Place row (listing)**:
How a single Place appears in a multi-location list or grid row. City and country are shown as a pair; any missing field renders as `-` (e.g. `Milan, -`).
_Avoid_: Hiding partial rows, omitting unknown fields

**Multi-location listing**:
When a studio, agency, or type foundry has more than one Place, each Place is shown on its own row in list and grid views — city and country stay paired (e.g. Milan / Italy, then London / UK). Rows follow the editor-defined order of the `places[]` array in Sanity. Never comma-join cities and countries into separate deduplicated lists. Duplicate city–country pairs are still shown as separate rows when they are separate Place documents.
_Avoid_: Aggregating cities and countries independently, deduplicating identical city–country pairs, sorting places alphabetically in listings
