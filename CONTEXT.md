# Pittogramma

Pittogramma is a cultural platform covering graphic design, visual culture, events, journal content, and related resources.

## Language

**Reading time**:
The estimated number of minutes required to read an Interview. It is calculated live from its intro, body text, questions, answers, quotes, and captions; it excludes titles, metadata, and media-only content, using 200 words per minute and rounding up. An editor may deliberately override the estimate for genuinely media-heavy pieces whose experience exceeds their text length.
_Avoid_: Manually maintained default duration, media viewing time

**Resource end-of-page CTA**:
An optional reusable CTA selected independently for each Resource page and displayed after that page's resource content.
_Avoid_: A single global Resource CTA, inline resource CTA

**Resource page settings**:
The dedicated Sanity singleton for one public Resource page. It provides that page's editable intro text, SEO, and optional Resource end-of-page CTA.
_Avoid_: Resource records, global Resource settings

**Resource page CTA destination**:
A public Resource page selected as the internal destination of a reusable CTA. Its fixed route is resolved by the front end.
_Avoid_: Storing the Resource page URL in a CTA

**Bibliography**:
An always-published Resource containing Pittogramma's curated list of books on graphic design. It is available at `/bibliography` and appears in Resource navigation.
_Avoid_: Treating Bibliography as an optionally published feature

**Bibliography Studio section**:
The Resources Studio subsection that groups Bibliography Page settings, bibliography entries, and Publishers. Publishers are maintained there because they are only referenced by bibliography entries and have no public Resource page.
_Avoid_: A separate Publisher Resource page, treating Publishers as a sibling public Resource

**Targeted Resource navigation**:
A Recent Updates link to a Resource index that brings its matching Resource into view and opens its existing detail dialog when one is available. Resources without a detail dialog only scroll to their matching item.
_Avoid_: Sending Recent Updates Resource links only to an unpositioned index page, treating them as external website links

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
The format of an event: Talk, Workshop, 5+1, or a generic Event. Shown as a solid pink chip on detail pages and as an outline badge on cards (TALK, WORKSHOP, 5+1, EVENT).
_Avoid_: Tag, category, tipologia (in code — use "type")

**Event card location byline**:
Short line under the event title on listing cards. Physical events: `at {locationName}` (e.g. "at Cruo Studio"). Online events: `online` only.
_Avoid_: "At" (capitalised), "Online" (capitalised), showing address on cards

**Attendance mode**:
Whether an event is held in person (`offline`) or remotely (`online`). Drives card byline, detail location display, and structured data. When online, location name and address are hidden in Studio.
_Avoid_: format, venue type, isOnline

**Event card destination**:
Where an event card sends a visitor. A Pittogramma event page renders at the event's branded `/events/{slug}` route; an external page uses that same branded route as a permanent redirect to an editor-provided HTTPS URL. Existing events default to a Pittogramma event page.
_Avoid_: Luma event, internal/external event, hosted on Luma

**External event redirect**:
The branded Pittogramma `/events/{slug}` route for an event whose card destination is an external page. Event cards open this route in a new tab; the route permanently redirects to the external URL with Pittogramma-managed `utm_source`, `utm_medium`, and event-slug `utm_content` parameters.
_Avoid_: External event page, Luma page (unless specifically referring to Luma's page)

**Content-type badge (detail page)**:
The solid-color chip above a detail page title that identifies the content type (Project, Articles, Diary, Baseline, Interview, Event). Its color maps to the content type: Project blue, Interview yellow, Diary green, Baseline purple, Article orange, Event pink; it remains visually unchanged on hover.
_Avoid_: Outline-only detail-page badges, discipline tags in the hero (those stay in metadata)

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

**Full project gallery**:
The ordered sequence of a Project’s Cover followed by every image and video in its Gallery. It can be browsed from a selected item without preserving the Gallery’s visual block grouping.
_Avoid_: Image gallery (it also includes video), individual gallery blocks (which only describe the page layout)

**Multi-location listing**:
When a studio, agency, or type foundry has more than one Place, each Place is shown on its own row in list and grid views — city and country stay paired (e.g. Milan / Italy, then London / UK). Rows follow the editor-defined order of the `places[]` array in Sanity. Never comma-join cities and countries into separate deduplicated lists. Duplicate city–country pairs are still shown as separate rows when they are separate Place documents.
_Avoid_: Aggregating cities and countries independently, deduplicating identical city–country pairs, sorting places alphabetically in listings

**Interview related Interviews**:
Up to four other Interviews suggested under the “Discover More” heading at the end of an Interview. Shared-tag Interviews appear first, then randomly selected unselected Interviews fill remaining positions; the current Interview is never recommended, and the random selection is shared while the page data is cached and rotates on revalidation. Cards use the standard plain Interview treatment (cover, title, and person-interviewee byline, with no content-type pill). Studio and Type Foundry interviews have no byline. An Interview recommends Interviews only, while a Project recommends Projects only.
_Avoid_: Project recommendations on Interview pages, Interview recommendations on Project pages
