# Trainer calendar menu (DL-036)

Calendar opens `/calendar` from the trainer desktop/mobile navigation and the admin menu selector. The route uses `requireTrainer()` and shares `TrainerCalendar` with the existing dashboard overview.

This exposes the existing current-month calendar; appointment storage and scheduling are still pending. No database or API contracts changed.

Validation: Next production build, TypeScript and lint passed (two existing image warnings). Development preview `dpl_FHDM2MycBhd3QsvubCWQnpMcXeGS` is Ready. Authenticated/anonymous deployment smoke checks verify navigation, calendar rendering and the retained dashboard view.
