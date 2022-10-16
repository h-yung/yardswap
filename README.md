# Yard swap

In a "marketplace" based on trust and zero dollars, authorized users can list their items, provide a single image and brief description, and let other users call dibs on the item.

- Users can "match" if they each have placed dibs on at least one item in each other's grouping.
- Users can remove their dib and add it back on an item (but will be pushed to end of the queue immediately following those actions).
- Users can also choose to gift their item to those who have placed a dib.
- At their own discretion, users can communicate via the comments/messaging area for individual item listings and also move on to email comms.

[More documentation here (Setup, Issues, questions to resolve)](https://github.com/h-yung/yardswap/blob/main/shared-notes.md).

Includes user authentication, post/comment attribution, placing dibs (joining a queue), etc.
Repurposes the 100Devs binary-upload-boom social app.

**Tech used**:
- EJS (not ideal, but bypasses a lot of CORS pain esp with the image POST reqs).
- Node, Express, MongoDB and Mongoose.
- Bootstrap for styling. Also not ideal and may replace.
- Cloudinary and multer for media handling and storage. 
- passport and a few other middlewares for authentication, sessions, etc. 

## Previews
### **View own profile**

![yard_swap_v2](https://user-images.githubusercontent.com/102257735/196018949-e081609c-3895-44d4-83b4-d7b0e11c067e.png)

--- 
### **Item page**

![yard_swap_v2-post](https://user-images.githubusercontent.com/102257735/196019825-6996b867-5666-457e-bb17-83c44f03e466.png)

---
### **Item page (viewed by owner)**
Matches are flagged, though maybe too subtly. Owner can't call dibs but can delete item listing.

![yard_swap_v2_ownItemPage](https://user-images.githubusercontent.com/102257735/196019839-159976d5-4268-4781-b24f-672d94961d16.png)

---

## Learnings summary
**Performance/optimization**
- Current methods iterate over the arrays and are inefficient - as evidenced by the delayed response to likes and redirections.
   - [Fun commentary from back in 2013](http://www.sarahmei.com/blog/2013/11/11/why-you-should-never-use-mongodb/) that seems highly relevant...
- PUT and DELETE reqs use method overrides to bypass the need for client-side JS complexity, but also removes the option of cautionary alerts from front end ("Are you sure you want to delete this post?"). Keeps things lighter on the "front" but maybe worth adding the caution.

**Quirks**
- Remember that new doc creation also needs to have a default value (even if empty) for new fields. Otherwise, next queries result in errors. Mongoose/Mongo and EJS handles falsy a little strangely (if field does not exist in the doc, all rendering fails, rather than proceeding with assumed "false").
- forEach does not care about async/await; use a regular for... loop if needed.
