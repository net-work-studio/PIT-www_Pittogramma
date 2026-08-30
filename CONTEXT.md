# Pittogramma

Pittogramma is a cultural platform covering graphic design, visual culture, events, journal content, and related resources.

## Language

**Pittogramma**:
The public name of an informal cultural project and collective. Pittogramma is not currently a company, association, or other legal entity.
_Avoid_: Pittogramma company, Pittogramma association, incorporated organisation

**Website operator**:
Fabio Mario Rizzotti, the person currently responsible for operating Pittogramma and its website from Italy.
_Avoid_: Pittogramma as the legal operator, the Pittogramma team collectively as operator

**Adult project submitter**:
A Project submitter who confirms they are at least 18 years old. Pittogramma does not accept Project submissions from minors.
_Avoid_: Collecting a full date of birth solely to establish eligibility, minor submitter

**Submitting representative**:
The adult designer who submits a Project and confirms they have authority to submit the supplied materials and agree to the terms for every named designer and collaborator.
_Avoid_: Assuming Pittogramma itself obtained separate approval from every collaborator

**Project submission fee**:
The non-refundable EUR 5 fee paid by the Submitting representative to have Pittogramma process a Project submission, calculated per named designer. It pays for processing time, not for copyright in Submitted materials. Payment does not guarantee selection or publication, and mandatory statutory refund and withdrawal rights still apply.
_Avoid_: Publication fee, guaranteed placement, no refunds under any circumstances

**Submitted materials**:
The images and text a Submitting representative sends with a Project submission. Pittogramma may receive transferable economic copyright in these materials, but not ownership of the underlying Project.
_Avoid_: The Project itself, a designer's future work, a blanket transfer of all rights

**Submission terms acceptance**:
The required confirmation by which a Submitting representative accepts the Project Submission Terms for themselves and every named designer and collaborator before payment.
_Avoid_: A footer link as proof of acceptance, presumed agreement by collaborators

**Launch consent model**:
Pittogramma launches without optional tracking, analytics, behavioural advertising, maps, or external video embeds. Outside the embedded submission form, it uses only technical theme-preference storage, so no sitewide consent banner or preference centre is shown until a non-essential service is introduced. Fillout's own cookie notice and consent control must be enabled within the submission form.
_Avoid_: Precautionary cookie banner, dormant consent categories, loading optional third-party resources before consent

**Legal page**:
A fixed-route, Sanity-managed public document containing Pittogramma's legal
copy. Legal pages are the Legal Notice / Impressum, Privacy Policy, Cookie
Policy, and Project Submission Terms. They are available from the footer;
Project Submission Terms is also linked from the Project submission page.
_Avoid_: Static legal copy embedded in a route, an unpublished legal-page route

**Direct sponsorship**:
A paid or in-kind placement agreed directly between Pittogramma and a sponsor, presented without selecting visitors through behavioural tracking.
_Avoid_: Programmatic advertising, personalised advertising

**Affiliate link**:
An outbound link through which Pittogramma may receive a commission when a visitor completes a qualifying action with the linked provider.
_Avoid_: Neutral editorial link, behavioural advertising

**Designer Index ordering**:
The visitor-selected ascending or descending order applied to any visible desktop column of the public Designers Index. The default is Designer name A–Z.
_Avoid_: Chronological designer ordering, manually fixed list order, name-only sorting

**Designer project sort key**:
The alphabetically first title among a Designer’s associated projects, used when the Designers Index is ordered by Projects.
_Avoid_: Project creation date, the number of associated projects, the arbitrary display order of projects

**Missing Designer Index value**:
A Designer Index value that is absent and rendered as `-`. Missing values always sort after populated values in either direction.
_Avoid_: Treating `-` as a literal sortable value, placing absent values first in descending order

**Code block (Journal)**:
A Journal content block for a short piece of monospaced text. Line breaks and
repeated spaces are preserved exactly as entered. It is editorial content
rather than syntax-highlighted programming code; it renders in a muted surface
with rounded corners and internal padding. Studio provides one multiline Text
field, without language or syntax-highlighting controls.
_Avoid_: Quote (the existing large serif pull-quote style), syntax-highlighted code

**Editorial line break**:
A line break or blank line intentionally entered in a visitor-visible
multiline text field in Studio. Every Editorial line break is preserved on the
public site; ordinary repeated spaces remain collapsed.
_Avoid_: Code-block whitespace, paragraph style

**Footnote (Journal)**:
An inline citation or editorial note in a Journal entry. Footnotes are numbered
automatically in reading order, link to a generated endnotes list, and provide
a return link to the cited passage. One Footnote can hold a bibliographic source,
a URL, or a brief explanatory note. Studio provides a required Note field and
an optional URL field. The generated Footnotes section appears at the end of an
entry only when that entry contains Footnotes. On desktop, the Footnote marker
previews its Note in a popover on hover or keyboard focus; clicking still goes
to its endnote.
_Avoid_: A manually ordered References list, duplicated source text

**References list (Journal)**:
The legacy standalone list of Journal references. It is retained temporarily
for comparison, but new citations use Footnotes.
_Avoid_: Adding new citations to a References list

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

**Index**:
The public navigation and Studio sidebar grouping for Pittogramma’s curated directories, including Studios / Agencies, Type Foundries, Bibliography, and the other existing Resource pages. “Index” is the user-facing label; internal code may continue to use Resource terminology.
_Avoid_: Renaming individual directory types, treating Index as a separate content type

**Index availability**:
The editorial Site Settings configuration that controls whether an Index is published and which of its supported public views are enabled. It has one fixed, named configuration section for each Index. Every published Index has at least one enabled view.
_Avoid_: Deployment-time feature flags, a published Index with no usable view

Missing Index availability values retain the all-enabled default during the configuration rollout.

An unpublished Index is unavailable at its public route and returns a 404. Permanently retired Indexes may subsequently have their content deleted from Sanity.

Search availability is configured only for Studios / Agencies, Type Foundries, Institutes, Bookshops, Websites, and Glossary. Header search availability is a separate site-wide setting.

**Bibliography**:
An always-published Resource containing Pittogramma's curated list of books on graphic design. It is available at `/bibliography` and appears in Resource navigation.
_Avoid_: Treating Bibliography as an optionally published feature

**Bibliography availability**:
The fixed availability state shown in Site Settings for Bibliography. It is published, with no editable view or search controls because the public Bibliography is one sortable list.
_Avoid_: Configurable Bibliography publication, dormant view or search toggles

**Bibliography Studio section**:
The Resources Studio subsection that groups Bibliography Page settings, bibliography entries, and Publishers. Publishers are maintained there because they are only referenced by bibliography entries and have no public Resource page.
_Avoid_: A separate Publisher Resource page, treating Publishers as a sibling public Resource

**Contribution form**:
An external Notion form for proposing a particular Resource type. The currently available Contribution forms propose a Studio / Agency, a Type Foundry, or a Bibliography entry. Each form is optional and is configured from the dedicated Contributions tab in Site Settings; the public Contribute page shows only forms with a configured URL and opens them in a new tab.
_Avoid_: Project submission form (which has its own `/submit` route), a general-purpose contribution form

**Contribute page**:
The public `/contribute` page, titled “Contribute to the index,” that lists the currently configured Contribution forms and directs visitors to the appropriate external Notion form. It has no introductory copy. Contribution forms do not appear on individual Resource indexes.
_Avoid_: Project submission page, repository contribution guide. The footer link uses the same “Contribute to the index” label.

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

**Homepage content stream**:
The fixed number of editorial and advertising cards shown on the homepage. Projects, Interviews, Journal entries, and Events share one chronological stream, ordered by their publishing date; adding a content type replaces another stream card rather than increasing the card total.
_Avoid_: Separate per-type homepage feeds, event-date ordering, an expanding homepage card count

**Sponsored placement**:
A clearly labelled, paid placement for one external partner within Pittogramma's public editorial experience. A placement has a stable identifier, a campaign period, a destination URL, and a defined reporting method. It is separate from a Contributor, which records an organisation's identity and editorial credit.
_Avoid_: Treating every Contributor as paid advertising, calling a pageview an ad impression

**Viewable sponsored impression**:
A recorded sponsored placement that meets Pittogramma's stated visibility rule. The rule and measurement method appear in advertiser reporting before the placement is sold.
_Avoid_: Pageview, served impression, an unstated viewability threshold

**Event publishing date**:
The editorial date when an Event joins the homepage content stream. It is independent of the Event's start and end dates, which only describe when the event happens.
_Avoid_: Deriving editorial position from event schedule

**Homepage-eligible Event**:
An Event whose end date (or start date when no end date exists) is today or later. Only Homepage-eligible Events can appear in either the homepage content stream or homepage hero.
_Avoid_: Showing completed Events on the homepage, treating an Event ending today as past

**Homepage featured item**:
The optional editorial item selected for the homepage hero. A Project, Interview, Journal entry, or Event may be featured; the featured item does not also appear in the homepage content stream.
_Avoid_: A hero item duplicated in the card stream, a hero limited to Projects and Interviews

**Past (events)**:
Events that have ended.

**Event type**:
The format of an event: Talk, Workshop, 5+1, or a generic Event. Shown as a solid `pink-300` (`--color-pink-300`) chip on event detail pages and as an outline badge that becomes `pink-300` on hover on event cards (TALK, WORKSHOP, 5+1, EVENT).
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

**Free-form media**:
An editor-selected presentation available only for a single-image Journal body block. It opts that image out of its default editorial crop: the image retains the existing centered single-media width and its height follows the source image’s intrinsic proportions, without cropping. It is unavailable for videos; multi-image Journal blocks and video players retain their fixed editorial ratios. It is not available on Project, Interview, or About media.
_Avoid_: “don’t respect aspect ratio”, uncropped frame, free-form grid

**Journal body image**:
An image placed within the portable-text body of an Article, Diary, or Baseline Journal entry. It uses the default editorial crop unless the editor selects Free-form media. This rule does not apply to Covers, Featured Covers, or listing-card imagery.
_Avoid_: Journal cover image, always-free-form Journal image

**Interview related Interviews**:
Up to four other Interviews suggested under the “Discover More” heading at the end of an Interview. Shared-tag Interviews appear first, then randomly selected unselected Interviews fill remaining positions; the current Interview is never recommended, and the random selection is shared while the page data is cached and rotates on revalidation. Cards use the standard plain Interview treatment (cover, title, and person-interviewee byline, with no content-type pill). Studio and Type Foundry interviews have no byline. An Interview recommends Interviews only, while a Project recommends Projects only.
_Avoid_: Project recommendations on Interview pages, Interview recommendations on Project pages
