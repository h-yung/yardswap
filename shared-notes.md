# Yardswap documentation

## Setup

**Install**
`npm install`

**Things to add**

- Create a `.env` file in config folder and add the following as `key = value`
  - PORT = #### (can be any port example: 3000)
  - DB_STRING = `your database URI`
  - CLOUD_NAME = `your cloudinary cloud name`
  - API_KEY = `your cloudinary api key`
  - API_SECRET = `your cloudinary api secret`

**Run**
`npm start`

## Questions to resolve

When users have completed a swap and a relevant item is taken off the market:

- how is the item taken off market? (isArchived boolean key in schema?) Current approach is to let the users simply delete something. However, an archival function would be helpful to preserve a previous review/testimony of the recipient. This also means a basic filtering (gone/available) is still needed, and similarly, some separation in a user's profile.
- if item is archived (swap is complete or item is not available anymore), "match" condition should be reset/based on only items not archived.

- Users should be able to reach out to those who have placed dibs to facilitate a swap or gift.
- Could make user email visibility conditional for item owner(s) to reach out, but currently it's just at user discretion.

Should the app enforce a "first dib always gets the item" or gently recommend it and just leave the item owner to decide based on the users who have called dibs?

- Currently, the item owner decides. Plus, there could be a late dib-placer who also matches (has an item that the owner of _this_ item called dibs on).

How to encourage item review of item description accuracy? This is currently unenforceable on an app level unless there is a condition that prevents a second dib being placed if there is a completed item swap/gift but no comment from the user.

- Require in order for the recipient(s) to place another dib or finalize another swap/receive another gift?
- Note that this review would be required of the recipient of the item.
- But then would need some confirmation or report of swap completion. Currently it's just a recommendation.

## Assumptions

- similar locale or willingness + ability to ship or pickup (arranged off-app)
- trust among users (may still need specific release of the user's email, perhaps triggered via "match" or some other method tbd)
- not for large commercial users: By design and to limit complexity, it's going to be hard for users to filter items by tags or categories (this functionality is not planned).
- Types of items can range from yard-saley type things - blankets, tchotkes, the odd furniture and dishware, bins, etc., minor crafts, to potentially keyboards, books, etc. that the owner is willing to swap and to an extent, gift to others to reuse.

## Issues

- [x] Update schema and write logic to check the order of user ids in "liked"/dibs array.
  - [x] build match view and queued dibs view (in post view) for user who is the owner.
- [x] Prevent user from calling dibs on their own items.
- [ ] Rewrite the backend terminology to fit purpose.
- [ ] Update database terminology to fit purpose.
- [ ] Create archival functionality and update UI to allow filtering for available/unavailable items.
  - update item schema to include this key
  - update UI for PUT req by item owner
  - update matches logic to account for archival status
  - update UI for feed to allow filtering, and update UI of profiles for better display of separate lists
- [ ] Make it possible for commenter to delete their own comments.
- [ ] Make it visually acceptable and mobile responsive. Possibly let people swipe... on items!
- [ ] Optimize: extract repetitive logic, write tests, and fix some ongoing bugs (e.g., strange focus area when navigating by tab).
- [ ] Make it possible to have various tiers of access based on sub-groupings that users can opt into.
  - Option 1: If U1 and U2 are friends, and U2 and U3 are friends, U2 can see U1 and U3 items, and U2's items can be seen by both U1 and U3. But U1 and U3 cannot see each other's items.
  - Option 2: Alternately/on a smaller scale, everyone sees everyone's items, but U1 cannot call dibs on U3's items nor can U3 call dibs on U1's items. They can still add each other's items to a favorites list.
  - **Note**: I feel that this can go against the desire to have a broadly accessible yard swap where the main authentication and validation happens when a user signs up (theoretically).

## Misc

For posterity: how to get the req.user part if you have a different front end setup (i.e., React rather than using EJS view engine) where you need to create the req body explicitly?

- Advice/response received: A common approach is for the frontend to make a request to the backend to get the currently logged in user information, then store that in react state. Fancier approaches include the backend telling the frontend which user is currently loggedin on initial request, or including such information in a cookie so the react app can get the current logged in user without making an additional request.
