# Move customer records from Nexudus

Source checked 6 October 2026: [Nexudus: Exporting Customers](https://help.nexudus.com/docs/exporting-customers). A full unrestricted admin can export from Operations > Members and contacts. Select a record and use the export icon. Filters limit the selection; check that the intended location and population are included. Nexudus supplies an XLS workbook with customer IDs and account data.

1. Preserve the original XLS privately. Save its customer worksheet as UTF-8 CSV in a spreadsheet application. Do not export passwords or payment credentials into this project.
2. Create the matching location using /add. Compare the first records and source IDs. The base accepts Id, Customer ID or CoworkerId; FullName, Full Name or Name; Email or Email Address; CompanyName or Company. These aliases are tested assumptions, not a guarantee of current vendor headers.
3. If columns differ, create imports/map.json such as {"id":"Customer number","name":"Customer name","email":"Email","company":"Organisation"}.
4. Run npm run cowork -- import nexudus --file=imports/customers.csv --location=AKL --map=imports/map.json --dry-run. Omit --map when aliases match. Review counts and mapping before repeating without --dry-run.
5. Run members and member for samples, and export a snapshot. Compare counts and IDs with Nexudus. Import marks every row as contact; verify before activation.

One import command carries the four mapped fields once the workbook has been saved as CSV. This is not a whole-account migration. Custom fields, customer notes, memberships, plans, rooms, bookings, invoices, visitor history, documents, access credentials and recurring payment instructions do not carry over automatically. Export and reconcile those separately, then enter verified opening records through /add or scope a mapping with Enterprise DNA. Do not cancel the old system until the operator has checked dates, balances and every required connection.

Nexudus does not publish a fixed customer-export header contract on the cited help page. examples/nexudus-customers.csv is a synthetic fixture. Test your own export before promising a production cutover. Source IDs are scoped by location. Duplicate IDs in a file fail; identical repeat imports skip; changed mapped rows stop rather than overwrite. An error rolls back the complete file. The import log retains only mapped fields and a fingerprint, not the full sensitive export.
