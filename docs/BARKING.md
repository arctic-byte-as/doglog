# Barking content (DL-066)

Created the Barking core subject in the live shared Skills Library on 2026-10-17. The five lessons in data/barking.json each include a title, goal, training details (steps), coaching notes and a YouTube link. Existing subjects, including Reactivity Training, were preserved exactly. No schema or application runtime change was required.

Sources: Kikopup / Emily Larlham. Her [training approach](https://dogmantics.com/) uses positive reinforcement without physical or psychological intimidation. Lesson copy is original coaching guidance, not a transcript of the videos.

| Lesson | Source video |
| --- | --- |
| Feeling Comfortable Around Everyday Noises | https://www.youtube.com/watch?v=Jp_l9C1yT1g |
| Staying Calm When Other Dogs Bark | https://www.youtube.com/watch?v=qPpEpQXTQb4 |
| Confidence Around Unfamiliar People | https://www.youtube.com/watch?v=LXCELHDT2fs |
| Calmer Walks Around Triggers | https://www.youtube.com/watch?v=JY7JrteQBOQ |
| Managing Barking at Windows and Fences | https://www.youtube.com/watch?v=Vd4_tuSqoYM |

All five YouTube oEmbed responses returned the expected Kikopup title/creator and embed HTML. This verifies current public metadata, not playback in every region. Live import used the authenticated Supabase Management API in an isolated workspace linked to production. A private backup and compare-and-swap update protected existing content and concurrent edits. The read-back library matched the complete expected JSON exactly. Backup: /private/tmp/doglog-live-content/library-before-barking.json (temporary local recovery copy).

The existing import helper now accepts an optional content file, preserving its Reactivity default:

```sh
node scripts/add-reactivity-lessons.cjs --content data/barking.json --allow-new-subject
# Review the dry run and explicitly select the intended database before adding --apply.
```

Merge checks passed for complete fields, adding the new subject, preserving other subjects, idempotent repeated imports and refusing a missing subject when creation is disabled. No customer-specific assignments were changed.
