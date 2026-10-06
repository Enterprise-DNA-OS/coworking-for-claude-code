---
description: "update for the coworking operator"
---

# update

Read docs/cli.md and the existing record. Put supplied changes in imports/changes.json. Run `npm run cowork -- update <type> <reference> --data=imports/changes.json`. Relationships and identity fields are immutable. paid_cents is the cumulative amount from the external ledger, never an increment or a payment instruction.
