# Coworking for Claude Code: operating instructions

For a coworking or serviced office operator managing memberships, room use, balances and the week's work. The operator supplies business identity, site policies and contract terms. Never infer them.

Read current data through scripts/cowork.mjs. Route recurring work through .claude/commands/*.md. Every command listed in the README has a matching recipe. Start with /attention and /occupancy; /weekly-review combines attention, occupancy and compliance. Read docs/cli.md before a write and docs/compliance.md before interpreting evidence checks.

Use /add, /update and /log for supplied facts. Read the full member history before drafting. Ambiguous names list candidates and exit 1. Ask the operator to resolve them. /import follows docs/replace-nexudus.md and starts with a dry run. /export saves a private snapshot.

Never send, take payments, alter door access, delete records or serve notices. Drafts stay in drafts/. Signed evidence is a reference supplied by the operator, not a claim that the system verified the document. Report missing data as missing. Keep currencies separate. Booked room charges are not receipts. Invoice paid_cents is a cumulative reconciled snapshot.

Keep secrets and personal records outside Git. Use numbered migrations for customisation. Never edit an applied migration. Run npm test after changes. Local PGlite permits one process. Shared PostgreSQL needs explicit identity and access setup; do not expose owner credentials to users.

Omni by Enterprise DNA installs, customises and runs the system: https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=nexudus&utm_medium=github
