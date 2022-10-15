# Yard swap

In a "marketplace" based on trust and zero dollars, authorized users can list their items, provide a single image and brief description, and let other users call dibs on the item.

- Users can "match" if they each have placed dibs on at least one item in each other's grouping.
- Users can also choose to gift their item to those who have placed a dib.

Assumptions:

- similar locale or willingness + ability to ship or pickup (arranged off-app)
- trust among users (may still need specific release of the user's email, perhaps triggered via "match" or some other method tbd)
- not for large commercial users: By design and to limit complexity, it's going to be hard for users to filter items by tags or categories (this functionality is not planned).
- Types of items can range from yard-saley type things - blankets, tchotkes, the odd furniture and dishware, bins, etc., minor crafts, to potentially keyboards, books, etc. that the owner is willing to swap and to an extent, gift to others to reuse.

Repurposes the 100Devs binary-upload-boom social app.

Includes user authentication, post/comment attribution, unique dibs (repurposing "likes"), etc.

**Tech used**:
EJS (not ideal, but bypasses a lot of CORS pain esp with the image POST reqs)
Node, Express, etc

![yard_swap_v1](https://user-images.githubusercontent.com/102257735/195973058-0f3c156a-1cb3-4778-addd-b0a4826bdbde.png)
---
![yard_swap_v1-post](https://user-images.githubusercontent.com/102257735/195973060-4ffa858d-9089-43af-8c24-10f06d7119ba.png)

## Questions

When users have completed a swap and a relevant item is taken off the market:

- how is the item taken off market? (isArchived boolean key in schema?)

Do users have to match on item interest? Users should be able to reach out to those who have placed dibs to facilitate a swap or gift.

- conditionally, based on "dibs" status, allow item owner specifically to see who has called dibs and their emails.

Should the app enforce a "first dib always gets the item" or gently recommend it and just leave the item owner to decide based on the users who have called dibs?

- Currently - inclined to let item owner decide. Plus, there could be a late dib-placer who also matches (has an item that the owner of _this_ item called dibs on).

How to create conditional/track the state of the item and link to the users better: such that a review of item accuracy is required in order for the recipient(s) to place another dib or finalize another swap/receive another gift?

- Note that this review would be required of the recipient of the item.

Match

1. check user who called dibs ("USER1") on the item: find all their currently listed items.
2. check if the item owner user id is in any of the dibs arrays for that user's items.
   What if more than 1 match is found or exists? How best to display or alert the user? And how to include the item of interest?

- alerts of matches should be at top of user's profile, visible only to the user themself when viewing their own profile.
- profile should show their list of items (all)
- if user logged in, profile shows the dibbed item list (can be made public if user wants). Instead of "favorite/bookmark for later" list.

**On deck**

- Rewrite the ejs templates to fit purpose.
- Make it possible to sort items in feed in some way beyond the default (recency, in descending order).
- Make it possible for commenter to delete their own comments.
- Make it visually acceptable.
- Make it possible to have various tiers of access based on sub-groupings that users can opt into.
  - Option 1: If U1 and U2 are friends, and U2 and U3 are friends, U2 can see U1 and U3 items, and U2's items can be seen by both U1 and U3. But U1 and U3 cannot see each other's items.
  - Option 2: Alternately/on a smaller scale, everyone sees everyone's items, but U1 cannot call dibs on U3's items nor can U3 call dibs on U1's items. They can still add each other's items to a favorites list.
  - **Note**: I feel that this starts going against the desire to have a broadly accessible yard swap where the main authentication and validation happens when a user signs up (theoretically).
- Users can use comment function for public comms and also review the item quality/state/accuracy of description and visual. This is unenforceable on an app level unless there is a condition that prevents a second dib being placed if there is a completed item swap/gift but no comment from the user.

---

OLD NOTES

**Done**

- Update multer config to accept GIFs.
- Post Likes are now unique users. _Approach:_
  - Need array in schema
  - when like is updated, check if user id is in array. If not, push user id into array and increment like. If yes, remove user id from array and decrement like.
- Format "user has liked" and "user has not liked" differently.
- Each comment has user attribution.
- Make it possible to like a post from the feed view:
  - Troubleshooting: The same conditionals and even others that worked previously/elsewhere (getPost) was not working for getFeed. Turns out that .lean() was stripping out some aspect of the doc that was preventing matching logic. Once removed, the previous conditional worked.
  - Proceeding with the working logic (.includes), but leaving comments (postsController.getFeed) for future testing as the reasons for failure for those are still TBD.
- Make it possible to visit other users' profiles, which will not have add post options.
- Make it possible to like comments.
- Change 'like' back to SVGs.
- Link commenter names to their profile pages.
- Personalize the header with username greeting when logged in.

## Learnings

With each update, my workflow has generally been in Model => Controller => View order as well.

- Keep test entries to a minimum since sometimes the schema has to change.
- Remember that new doc creation also needs to have a default value (even if empty) for new fields. Otherwise, next queries result in errors. Mongoose/Mongo and EJS handles falsy a little strangely (if field does not exist in the doc, all rendering fails, rather than proceeding with assumed "false").
- PUT and DELETE reqs use method overrides to bypass the need for client-side JS complexity, but also removes the option of cautionary alerts from front end ("Are you sure you want to delete this post?").

Current methods iterate over the arrays and are inefficient - as evidenced by the delayed response to likes and redirections.

- [Fun commentary from back in 2013](http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/) that seems highly relevant...

For posterity: how to get the req.user part if you have a different front end setup (i.e., React rather than using EJS view engine) where you need to create the req body explicitly?

- Advice/response received: A common approach is for the frontend to make a request to the backend to get the currently logged in user information, then store that in react state. Fancier approaches include the backend telling the frontend which user is currently loggedin on initial request, or including such information in a cookie so the react app can get the current logged in user without making an additional request.

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
