# Coworking for Claude Code

Members, agreements, desks, offices, room bookings and recorded charges in a database you own. Free MIT code from Enterprise DNA. Works with Claude Code, Codex, OpenCode or Cursor.

| Do it yourself | We customise it | We run it for you |
|---|---|---|
| Free code, installed and operated by you. Hosting and agent costs remain yours. | Your fields, rules, screens, connections and Nexudus data mapping. [Talk about your version](https://enterprisedna.co/omni/book?offer=replace-software&utm_campaign=nexudus&utm_medium=github). | Installed and operated through Omni by Enterprise DNA. One setup fee, then a retainer. [See the offer](https://enterprisedna.co/omni/instead-of/nexudus?utm_source=github&utm_medium=readme&utm_campaign=nexudus). |

## Quick start

Node 20 or newer. Start on fictional records before importing business data.

```bash
git clone https://github.com/Enterprise-DNA-OS/coworking-for-claude-code.git
cd coworking-for-claude-code
npm install
npm run demo
npm test
npm run cowork -- attention
npm run view
npm run docs
```

Start with /occupancy, /renewals-due and /room-diary. The demo includes two fictional NZ/AU sites, stale contact dates, overdue charges and incomplete evidence. Seed is idempotent. Never seed a live database.

## What works today

Eleven record types and five joined views cover the weekly space review. Active desk and office allocations cannot overlap. Room bookings cannot overlap, except cancelled bookings. Adjacent bookings are allowed. Dates are UTC; provide an explicit timezone when recording bookings. Allocations reserve whole desks or offices, not individual seats within an office. Occupancy is allocated inventory, not physical attendance.

Money is stored in integer cents. Human reports show currency units and keep currencies separate. Room revenue reports show booked charges, not cash received. Recorded invoice payments are cumulative snapshots checked against your accounting system. No card details, payment processing, bank feeds, door controls, automatic billing, member portal or mobile app are included. Those connections and interfaces require a separately scoped implementation.

Nexudus already offers Explore reporting. These cross-record questions show what the free base answers today, without claiming that Nexudus cannot produce equivalent reports. The difference is ownership of the rules and records.

## Weekly commands

| Recipe | Job |
|---|---|
| /locations | Run `npm run cowork -- locations`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /plans | Run `npm run cowork -- plans`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /members | Run `npm run cowork -- members`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /spaces | Run `npm run cowork -- spaces`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /memberships | Run `npm run cowork -- memberships`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /occupancy | Run `npm run cowork -- occupancy`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /vacancies | Run `npm run cowork -- vacancies`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /renewals-due | Run `npm run cowork -- renewals-due`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /room-diary | Run `npm run cowork -- room-diary`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /bookings | Run `npm run cowork -- bookings`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /arrears | Run `npm run cowork -- arrears`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /invoices | Run `npm run cowork -- invoices`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /visitors | Run `npm run cowork -- visitors`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /actions | Run `npm run cowork -- actions`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /compliance | Run `npm run cowork -- compliance`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue. Read docs/compliance.md first. A clear result is not certification. |
| /quiet-members | Run `npm run cowork -- quiet-members`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /renewal-arrears | Run `npm run cowork -- renewal-arrears`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /room-revenue | Run `npm run cowork -- room-revenue`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /uninvoiced-bookings | Run `npm run cowork -- uninvoiced-bookings`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /expiry-exposure | Run `npm run cowork -- expiry-exposure`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /room-allowance | Run `npm run cowork -- room-allowance`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /late-visitors | Run `npm run cowork -- late-visitors`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /plan-mix | Run `npm run cowork -- plan-mix`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /member-history | Run `npm run cowork -- member-history`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /attention | Run `npm run cowork -- attention`. Read current records before answering. Keep currency and date context. Human reports show currency units. JSON fields ending in _cents are integer cents. Do not claim booked charges are collected revenue.  |
| /member | Run `npm run cowork -- member "<code, name or UUID prefix>"`. Read memberships, bookings, invoices and notes. Ambiguous matches list candidates and exit 1; ask the operator to select one. |
| /add | Read docs/cli.md. Write only operator-supplied fields to imports/record.json. Run `npm run cowork -- add <type> --data=imports/record.json`. Read the record back. Create locations, plans, members and spaces before dependent records. Never invent signed evidence. |
| /update | Read docs/cli.md and the existing record. Put supplied changes in imports/changes.json. Run `npm run cowork -- update <type> <reference> --data=imports/changes.json`. Relationships and identity fields are immutable. paid_cents is the cumulative amount from the external ledger, never an increment or a payment instruction. |
| /log | Read the member, then run `npm run cowork -- log <member> --author="<recorder>" --text="<observed contact>" --date=YYYY-MM-DD`. Notes are append-only. Correct a note with another note. Never invent an event. |
| /import | Read docs/replace-nexudus.md. Save the customer XLS export as CSV. Run `npm run cowork -- import nexudus --file=imports/customers.csv --location=<code> --dry-run`. Inspect mapped counts, then repeat without --dry-run. Supply --map when headers differ. Contacts need verification before activation; no membership, payment or access credential is inferred. |
| /export | Create a private exports folder. Run `npm run cowork -- export --out=exports/new-snapshot.json`. Verify all eleven collections. Existing files are not overwritten. This is a portable snapshot; use a tested database backup for restoration. |
| /weekly-review | Run `npm run cowork -- attention`, `npm run cowork -- occupancy` and `npm run cowork -- compliance`. Assign an owner and date to each decision. Run `npm run cowork -- weekly-review` to save the supporting records to drafts/. Nothing sends. |
| /draft-weekly | Run `npm run cowork -- draft-weekly`. Read the resulting file in drafts/. Check dates, source records and currencies. Add operator decisions. Nothing sends. |
| /draft-renewal | Read the member and signed agreement. Run `npm run cowork -- draft-renewal <member>`. Read the saved brief in drafts/. Check membership dates before use. It is not a served legal notice. Nothing sends. |
| /documents | Set business name, local logo path and colours in brand.json. Run `npm run docs`. Inspect the member statements, renewal briefs, room run sheets and site evidence reviews. Verify all balances externally. Outputs are drafts, not tax invoices or certifications. |
| /new-view | Read views.json and the migration. Add a fixed SELECT query for the requested report. Run `npm run view` and `npm test`. Inspect the read-only HTML. Keep generated member data private. |
| /customise | Export a backup first. Read CLAUDE.md, the migration and CLI allowlists. Write a new numbered migration for the requested field or rule, apply with `npm run migrate`, update affected queries, documents and recipes, then run `npm test`. Demonstrate with fictional data. Never edit an applied migration or guess a contract rule. |

## Ten questions across your records

1. Which members have a renewal approaching and overdue charges? (`renewal-arrears`)
2. Which desk or office is vacant today? (`vacancies`)
3. How much monthly membership value expires within sixty days by currency? (`expiry-exposure`)
4. Which members have gone thirty days without recorded contact? (`quiet-members`)
5. Which completed room bookings still need invoicing checked? (`uninvoiced-bookings`)
6. How does this month’s booked room time compare with each member’s allowance? (`room-allowance`)
7. Which visitors have no departure recorded after twelve hours? (`late-visitors`)
8. Which plans account for the current membership value at each location? (`plan-mix`)
9. Which members have bookings and outstanding balances but no contact notes? (`member-history`)
10. Which site evidence or retention reviews need attention? (`compliance`)

## Your first hour: ten things to ask for

1. Put our name and logo on member statements.
2. Add our membership manager field.
3. Set our renewal reminder window.
4. Map a checked sample of our Nexudus export.
5. Separate outstanding balances by location and currency.
6. Add our room cancellation rule.
7. Record our emergency testing schedule.
8. Add our membership agreement references.
9. Group room use by member company.
10. Prepare Monday’s occupancy and renewal brief.

/customise applies a new migration. /new-view adds a read-only report. Both recipes require tests and a demonstration with fictional records.

## Bring your Nexudus customer list

Nexudus exports customers as XLS. Save that workbook as UTF-8 CSV, then:

```bash
npm run cowork -- import nexudus --file=examples/nexudus-customers.csv --location=AKL --dry-run
npm run cowork -- import nexudus --file=examples/nexudus-customers.csv --location=AKL
```

The example is a synthetic fixture, not a captured vendor export. Match headers with --map when necessary. Import carries customer ID, name, email and company only. Identical repeats skip; changed rows stop for reconciliation; failed files roll back fully. Records arrive as unverified contacts. See [the switch guide](docs/replace-nexudus.md) for remaining data and checks.

## Database and shared use

Without DATABASE_URL, PGlite stores local data under .data/db. One process at a time. For PostgreSQL 15 or newer, provide DATABASE_URL and run npm run migrate. Tables enable row security without public policies; views respect caller permissions. The local operator is the database owner. Shared use needs staff identities, least-privilege roles, backups and restoration tests. There is no browser login or tenant isolation service in the base.

## Documents and evidence

npm run docs creates draft balance statements, renewal briefs, room run sheets and site evidence reviews. brand.json controls the business name, logo and colours. npm run view produces read-only HTML reports. Neither is a member application. Read [the evidence rules](docs/compliance.md) and [why there is no front end](docs/why-no-front-end.md).

## Nexudus pricing context

Nexudus bills active users per location. Its [detailed pricing](https://help.nexudus.com/docs/detailed-pricing), checked 6 October 2026, lists a white-label Passport app at EUR 150 per month for each five locations, excluding VAT, or EUR 1,800 over twelve months. This is an optional app fee, not the baseline subscription or a typical annual bill. The current baseline calculator could not be verified in this run, so no baseline figure or savings claim is made.

## Validation

npm test uses a fresh temporary database, ignores inherited production connection settings and exercises reads, writes, collisions, import rollback, ambiguity, row security, drafts and document rendering. The workflow defines Windows and Linux PGlite runs plus PostgreSQL validation. Local results describe the platform actually run; a workflow file is not evidence of remote success.

Generated data stays outside Git. Export snapshots do not replace database backups. Nothing here sends a message, takes a payment, opens a door or serves a legal notice.

MIT. Built by Enterprise DNA. Independent project; Nexudus is a third-party trademark and is not affiliated with this project.
