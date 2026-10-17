# Play video lessons (DL-067)

Published five new positive-reinforcement lessons to the existing live Play subject on 2026-10-17. The two original lessons and subject summary remain unchanged, giving seven lessons in total. Complete content is recorded in data/play.json with title, goal, training details (steps), coaching notes and YouTube URL.

| Lesson | Creator | Source |
| --- | --- | --- |
| Fetch Foundations — Bringing a Toy Back | Kikopup | https://www.youtube.com/watch?v=7Nm4goEuBt4 |
| Drop the Toy and Play Again | Kikopup | https://www.youtube.com/watch?v=tVivnOwiMoA |
| Cooperative Tug — Gentle Play and Pauses | Kikopup | https://www.youtube.com/watch?v=x9mPoWuvnLg |
| Take a Bow — A Playful Trick | Kikopup | https://www.youtube.com/watch?v=pT7-CHam2HU |
| Find It — Search for a Favourite Toy | Tug-E-Nuff | https://www.youtube.com/watch?v=nvDc6qVzais |

Sources: [Kikopup training approach](https://dogmantics.com/) and [Tug-E-Nuff original games guide](https://tug-e-nuff.com/en-us/blogs/news/games-for-dogs). Coaching copy is original guidance, not video transcripts. All selected links returned valid public YouTube oEmbed metadata with the expected title, creator and embed HTML. An unavailable fetch-tips candidate was excluded. Playback in every region was not tested.

Used the existing merge helper with data/play.json. Checks confirmed five additions, seven total, complete fields, preservation of both existing Play lessons and all other subjects, and idempotent repeated imports. Published using the authenticated Supabase Management API in the isolated live workspace. A private backup and compare-and-swap SQL protected the previous value and concurrent edits. Read-back matched the intended library exactly. Temporary recovery copy: /private/tmp/doglog-live-content/library-before-play.json. No customer-specific recommendations, schema, credentials or application runtime were changed.
