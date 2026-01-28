# Future Improvements

This document tracks potential improvements identified during code reviews that were deferred for future consideration.

## Performance Optimizations

### Convert resources-navigation to Server Component
**File:** `src/components/navigation/resources-navigation.tsx`
**Source:** Greptile code review (PR #3)
**Priority:** Low

The `ResourcesNavigation` component was converted to a client component but only uses `usePathname` for active state detection. Consider refactoring to keep it as a server component by passing the pathname as a prop from parent pages.

**Benefits:**
- Smaller client bundle size
- Component renders on server

**Trade-offs:**
- Requires updating multiple parent pages to pass pathname as prop
- Adds prop drilling complexity

**Implementation:**
1. Remove `"use client"` directive from the component
2. Add `pathname: string` prop to the component
3. Update all parent pages that use `ResourcesNavigation` to pass the current pathname
