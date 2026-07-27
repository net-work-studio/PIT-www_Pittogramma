# Pittogramma

Pittogramma is a cultural platform covering graphic design, visual culture, events, journal content, and related resources.

## Language

**Project submission**:
A project proposed to Pittogramma through the public submission flow. The flow has a stable canonical route at `/submit`, so it can evolve independently of its current form provider.
_Avoid_: Submission modal, Fillout page

**Submission form**:
The provider-hosted form embedded on the Project submission route. It owns the submission questions and accompanying instructions.
_Avoid_: Submission page, submission modal

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

**Content-type badge (detail page)**:
The outline badge above a detail page title that identifies the content type (Project, Articles, Diary, Baseline, Interview). Matches the label on listing cards but uses outline-only hover — no fill color.
_Avoid_: Colored card hover on detail pages, discipline tags in the hero (those stay in metadata)

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

**Contributor**:
An organization or entity that supports Pittogramma. Stored once in Studio (name, logo, optional description) and referenced wherever that entity appears — on events, the About page, editions, ads, and community items.
_Avoid_: Brand, sponsor document (as a type name — use `contributor`)

**Contributor role**:
How a contributor is labelled and presented on the front end in a given context — supporter (About), sponsor or partner (event), named credit (edition). One document in Studio; role and layout are decided per page, not stored on the contributor.
_Avoid_: Treating sponsor, partner, and supporter as different content types or backend entities

**Logo frame**:
The standard boxed presentation for a contributor logo. Optional copy below the frame is handled by a separate wrapper, so pages can show logo-only or logo plus description.
_Avoid_: Different logo treatments per page, inline logos without a frame

**About supporters**:
Contributors shown at the bottom of the About page. Logo frame only — no description.
_Avoid_: Sponsor, partner (on the About page)

**Event sponsor / partner**:
Contributors on an event detail page, grouped and labelled separately. Same document type; sponsor vs partner is editorial per event. Logo frame with optional description below.
_Avoid_: Supporter (on event pages)

**Edition supporters**:
Contributors credited on an edition detail page. Shown as names in metadata, not logo frames — different front-end presentation for that context.
_Avoid_: Expecting the same logo layout as About or events

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

**Portrait**:
The headshot image on a Person document (`portrait`). Editors set a hotspot focal point in Studio so faces stay in frame when the image is cropped to cards, avatars, or detail layouts.
_Avoid_: Portfolio image (there is no separate field — use `portrait`)

**Cover**:
The primary visual for a content item (project, event, interview, etc.). Either a still image or a video file.
_Avoid_: Thumbnail, hero (as CMS field names)

**Cover poster**:
When a cover is video, the still image shown before playback and in small listings (designer rows, cards). Stored in the cover’s Image field in Studio — the same field used for image-only covers. Required when cover type is Video; legacy items without one show a placeholder on the front end until updated.
_Avoid_: Video thumbnail, frame grab, separate poster field

**Multi-location listing**:
When a studio, agency, or type foundry has more than one Place, each Place is shown on its own row in list and grid views — city and country stay paired (e.g. Milan / Italy, then London / UK). Rows follow the editor-defined order of the `places[]` array in Sanity. Never comma-join cities and countries into separate deduplicated lists. Duplicate city–country pairs are still shown as separate rows when they are separate Place documents.
_Avoid_: Aggregating cities and countries independently, deduplicating identical city–country pairs, sorting places alphabetically in listings
