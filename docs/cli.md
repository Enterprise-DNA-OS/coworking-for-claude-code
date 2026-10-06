# CLI reference

npm run cowork -- --help lists every action. All actions accept --json. Reads accept no other flags. Unknown flags and extra arguments fail. Money fields are nonnegative integer cents; dates are real YYYY-MM-DD dates; timestamps require ISO time and Z or an explicit offset. Human outputs show currency units. JSON fields ending in _cents retain integer cents.

add <type> --data=file.json and update <type> <reference> --data=file.json accept the fields listed in FIELDS in scripts/cowork.mjs. Types: locations, plans, members, spaces, memberships, bookings, invoices, visits and actions. References accept exact codes, case-insensitive names and UUID prefixes. Multiple matches print candidates and exit 1. Foreign keys accept those references too.

Create a location, plan, member and space before a membership or booking. Member and plan must belong to the same location; allocated spaces must match too. Whole desk/office allocations with active status cannot overlap inclusive dates. Room bookings use half-open intervals, so adjacent bookings are allowed. Cancelled bookings release time.

Example location JSON: {"code":"AKL","name":"Our Space","currency":"NZD","jurisdiction":"NZ"}. Example member JSON: {"code":"M100","name":"Example Member","location_id":"AKL","email":"member@example.test"}. Example booking JSON: {"code":"B100","name":"Team meeting","member_id":"M100","space_id":"R1","starts_at":"2026-11-01T09:00:00+13:00","ends_at":"2026-11-01T10:00:00+13:00","charge_cents":5000}.

Active memberships need agreement_ref. Updating paid_cents requires reconciliation_ref when positive; paid_cents is cumulative and cannot exceed amount_cents. Closed actions need completion_ref. Relationship keys, codes, currency, jurisdiction and space kind cannot change via update. Contact notes and import logs are append-only. No deletion action exists.

export --out=exports/new-file.json writes all eleven collections consistently and refuses overwrite. Create the parent directory first. This is not a restore command. Keep a database backup for restoration.
