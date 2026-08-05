# Issue tracker: Linear

Issues and specifications for this repository live in Linear:

- Workspace: `nws2`
- Team: `Work` (`NWS`)
- Project: `PIT-www_Pittogramma`
- Project URL: https://linear.app/nws2/project/pit-www-pittogramma-1c4a7ffd19ac/overview

Use the connected Linear tools for all issue operations. Scope newly created
issues to the Work team and PIT-www_Pittogramma project unless the user
explicitly requests otherwise.

## Conventions

- Read or search existing issues before creating one to avoid duplicates.
- Use Linear issue identifiers such as `NWS-123` when an identifier is needed.
- Use native Linear parent/child and blocking relationships.
- Apply the labels defined in `triage-labels.md`.
- Record substantive discussion as issue comments.
- Close issues using an appropriate completed or canceled state.

## When a skill says "publish to the issue tracker"

Create a Linear issue in the Work team and PIT-www_Pittogramma project.

## When a skill says "fetch the relevant ticket"

Fetch the Linear issue by its identifier or URL, including its description,
labels, relationships, and comments when relevant.

## Wayfinding operations

Used by `/wayfinder`. A map is one Linear issue with child issues representing
decision tickets.

- **Map**: an issue labelled `wayfinder:map`, containing Destination, Notes,
  Decisions so far, Not yet specified, and Out of scope.
- **Child ticket**: a child issue of the map labelled `wayfinder:<type>`, where
  type is `research`, `prototype`, `grilling`, or `task`.
- **Blocking**: use Linear's native blocked-by relationship.
- **Frontier**: list the map's open child issues and select the first issue that
  has no open blocker and no assignee.
- **Claim**: assign the issue to the developer driving the map before beginning
  work.
- **Resolve**: add the answer as a resolution comment, close the issue, then
  append a short linked context pointer to the map's Decisions-so-far section.
- **References**: in human-facing text, refer to maps and tickets by their
  linked titles rather than bare identifiers.
