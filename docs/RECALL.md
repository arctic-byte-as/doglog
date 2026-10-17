# Recall video lessons (DL-068)

Published five new reward-based Recall lessons on 2026-10-17, preserving both existing lessons and the subject summary. Recall now contains seven lessons. Complete original coaching copy is recorded in data/recall.json: title, goal, training details (steps), coaching notes and YouTube link.

| Lesson | Creator | Video |
| --- | --- | --- |
| Recall Foundations | Dogs Trust Dog School | https://www.youtube.com/watch?v=tVaH30lld6k |
| Come Back and Reconnect | Battersea Dogs and Cats Home | https://www.youtube.com/watch?v=Q0xJ96DWO30 |
| Make Coming Back Worthwhile | Zak George | https://www.youtube.com/watch?v=rwldfBjFsdE |
| Check In Before Distractions Grow | Training Positive (Tab Shamsi) | https://www.youtube.com/watch?v=nLo8YP4-D8Y |
| Recall Relay | Tug-E-Nuff | https://www.youtube.com/watch?v=Ei1F1sgVz6k |

Research sources include the original YouTube metadata and Training Positive description, [Battersea recall guide](https://www.battersea.org.uk/pet-advice/dog-advice/how-teach-your-dog-recall), [Zak George recall guide](https://zakgeorge.com/come-when-called/), [Dogs Trust reward-based training policy](https://www.dogstrust.ie/dog-advice/dog-training-online/adult-dog-training-online), and [Tug-E-Nuff games guide](https://tug-e-nuff.com/en-us/blogs/news/games-for-dogs). All five videos returned public YouTube oEmbed metadata with expected title, creator and embed HTML. Full playback and region-specific availability were not tested. Lesson copy is original guidance, not video transcripts. Recall relay is labelled as a progression after foundations. Outdoor management, rewarding returns and avoiding corrections are included in the coaching.

Merge validation confirmed five additions, seven total, complete fields, exact preservation of existing Recall lessons and all other subjects, and idempotency. Publication used the authenticated Supabase Management API, a private backup and compare-and-swap update. Live read-back exactly matched the intended library. Temporary recovery copy: /private/tmp/doglog-live-content/library-before-recall.json. No application runtime, schema, credentials or customer-specific recommendations were changed.
