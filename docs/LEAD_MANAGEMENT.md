# Lead Management (DL-073)

Created the live Lead Management core subject on 2026-10-17 with five positive-reinforcement lessons, each including title, goal, training details (steps), coaching notes and a YouTube URL. Complete content: data/lead-management.json.

| Lesson | Creator | Video |
| --- | --- | --- |
| Comfortable Introductions to Walking Gear | Kikopup | https://www.youtube.com/watch?v=NUG_J7mIHvc |
| Choosing Comfortable Lead Equipment | Kikopup | https://www.youtube.com/watch?v=J2l8Qv1htUY |
| Lead Holds and Managing Spare Line | Simpawtico Dog Training | https://www.youtube.com/watch?v=6vj4QktIEvc |
| Coordinating Lead, Marker and Rewards | Kikopup | https://www.youtube.com/watch?v=3XUaef63Fd4 |
| First Steps with a Relaxed Lead | Training Positive | https://www.youtube.com/watch?v=1-eKSSuUaz4 |

Sources include original YouTube metadata/descriptions, [Kikopup’s training approach](https://dogmantics.com/) and [Simpawtico’s original handling guide](https://www.simpawtico-training.com/how-to-handle-a-leash-properly/). Used Training Positive’s updated tutorial linked from the older tutorial description. All five videos are new to the saved library and returned valid public oEmbed metadata with the expected title, creator and embed HTML. Full playback and region-specific availability were not tested. New coaching copy is original guidance, not transcripts. Lead holds are for safety and slack management, never corrections.

Merge checks passed for new subject creation, five complete lessons, exact preservation of every existing subject and idempotent repeated imports. Authenticated Supabase Management API publication used a private backup and compare-and-swap condition. Live read-back matched the expected complete library exactly. Temporary recovery copy: /private/tmp/doglog-live-content/library-before-lead-management.json. No runtime, schema or customer-specific recommendation changes.
