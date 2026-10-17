# Skills video links (DL-052)

Prepared 2026-10-15. The isolated development library now contains links for all 21 default lessons (16 distinct videos). Default fallback content has the same links. No production data or deployment has changed.

Existing production subjects and saved videos still need inspection. Apply by matching both category and lesson titles, filling only blank youtubeUrl values; retain all existing text, translations, order and nonempty links. Do not replace the whole production library with development defaults.

Selections follow the reward-based approach in the existing lesson guidance. Related lessons share some tutorials. Long-line recall uses Battersea’s line-handling tutorial alongside the existing recall guidance. Middle uses DOGGY U’s position tutorial for both introduction and practice. The videos are English-language; translated guidance remains unchanged.

Each distinct URL returned HTTP 200 YouTube oEmbed metadata with the expected title/creator and embed markup. This verifies public metadata and embed availability, not full playback in every region or an end-to-end viewing of each video. Matching checks verify all 21 default lesson URLs. No application logic, schema or dependencies changed.

| Subject | Lesson | Video | Creator |
| --- | --- | --- | --- |
| Boundaries | Room and threshold boundaries | [Door Manners for Dogs! - Dog Training](https://www.youtube.com/watch?v=kJboalA4oi4) | Kikopup |
| Boundaries | Outdoor boundary foundations | [Teach your dog to stay in your yard- Invisible Barriers Part 1- Dog Training](https://www.youtube.com/watch?v=OuTh47i3hOY) | Kikopup |
| Middle | Find middle | [Service Dog Training: Spin Into Middle ("Close") for Public Access and Transportation](https://www.youtube.com/watch?v=UaIJocl2i10) | DOGGY•U |
| Middle | Middle with duration | [Service Dog Training: Spin Into Middle ("Close") for Public Access and Transportation](https://www.youtube.com/watch?v=UaIJocl2i10) | DOGGY•U |
| Magic Mat | Mat orientation | [The EASIEST way to train your puppy to go to his bed - Dog training](https://www.youtube.com/watch?v=U2c5EkytNU0) | Kikopup |
| Magic Mat | Settle and release | [The Calm Settle - for dogs and puppies](https://www.youtube.com/watch?v=yr1olzgidMw) | Kikopup |
| Loose Leash Walking | Reward zone | [The ABSOLUTE BEST compilation of LOOSE LEASH WALKING TUTORIALS](https://www.youtube.com/watch?v=EK6PZ5l-3lI) | Kikopup |
| Loose Leash Walking | Sniff and walk balance | [Leash Walking Tip: Teach 'go sniff'](https://www.youtube.com/watch?v=5Kt_pi1z1sA) | Kikopup |
| Contact | Offered check-in | [FASTEST and EASIEST way to train EYE CONTACT - Dog Training by Kikopup](https://www.youtube.com/watch?v=w4ASIKw-urY) | Kikopup |
| Contact | Contact around distractions | [Building Attention: Game 1 -  dog training](https://www.youtube.com/watch?v=aTSuPk2Ccjo) | Kikopup |
| Engagement | Offered engagement | [FASTEST and EASIEST way to train EYE CONTACT - Dog Training by Kikopup](https://www.youtube.com/watch?v=w4ASIKw-urY) | Kikopup |
| Engagement | Follow the movement | [The Attention Game!](https://www.youtube.com/watch?v=HiziN7mluz8) | Kikopup |
| Engagement | Engagement around distractions | [Building Attention: Game 1 -  dog training](https://www.youtube.com/watch?v=aTSuPk2Ccjo) | Kikopup |
| Play | Toy engagement | [Tip for Using Toys to Train Your Dog -  Dog Training](https://www.youtube.com/watch?v=UyVkZrlcVSA) | Kikopup |
| Play | Tug with rules | [Drop RELIABLY while TUGGING - Dog Training Tip of the Day](https://www.youtube.com/watch?v=Cv4seQbdVfY) | Kikopup |
| Target Hand | Nose to hand | [Touch - target training - Dog Training](https://www.youtube.com/watch?v=RWSJVwZybwo) | Kikopup |
| Target Hand | Target for movement | [Touch - target training - Dog Training](https://www.youtube.com/watch?v=RWSJVwZybwo) | Kikopup |
| OK | Release from stillness | [How to train a RELEASE CUE -   down stay training! down stay fun!](https://www.youtube.com/watch?v=tKHTYneseaw) | Kikopup |
| OK | Permission to access | [Door Manners for Dogs! - Dog Training](https://www.youtube.com/watch?v=kJboalA4oi4) | Kikopup |
| Recall | Recall party | [COME when CALLED - First training session](https://www.youtube.com/watch?v=VuyjjkSPRfU) | Kikopup |
| Recall | Long-line recall | [How To Use A Long-Line Lead | The Battersea Way](https://www.youtube.com/watch?v=X6Uuf1ykMfI) | Battersea Dogs and Cats Home |

Production access: automatic approval review rejected a production environment download because it would retrieve sensitive credentials without explicit approval. The browser connection has no available signed-in browser. Production application of these links is pending an approved access method.

Development verification: database read-back confirms 21 linked lessons. Remote UI verification was attempted with the existing development customer test login, but login returned 401; thumbnail/player rendering was therefore not verified remotely in this task.
