# Triggers subject removal (DL-069)

On 2026-10-17, removed the live core subject named "How to handle triggers?" at the user's request because Reactivity Training covers this topic. Removed its subject summary and all three subcategories (Dogs, Bikes, Bikes), including their goals, training-step placeholders, coaching-note placeholders and empty video-link fields.

All other subjects, including the five Reactivity Training lessons, were preserved exactly. The subject is absent from the built-in defaults, so loading defaults does not recreate it. This was a shared Skills Library content change; no application runtime or schema change was needed.

The authenticated Supabase Management API update used a private backup and compare-and-swap condition to avoid overwriting concurrent edits. Live read-back exactly matched the intended remaining library. Temporary recovery backup: /private/tmp/doglog-live-content/library-before-remove-triggers.json. No customer records or separate customer recommendation snapshots were changed.
