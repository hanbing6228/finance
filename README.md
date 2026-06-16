# Finance

Finance is the standalone FIP personal finance analytics module. The MVP is
designed as a data-package-driven system first, with a future static integration
path into the Baohe toolbox as the `finance` module.

Start here:

- [FIP MVP Documentation Pack](docs/fip/README.md)
- [Product Requirements](docs/fip/prd-v1.md)
- [Technical Design](docs/fip/technical-design-v1.md)
- [API and Mobile Specification](docs/fip/api-mobile-spec-v1.md)
- [Database Schema](docs/fip/db/schema-v1.sql)

MVP boundaries:

- Rules are configuration modules, not hard-coded bank logic.
- CSV/JSON/YAML data packages are supported first.
- Real bank authorization, payments, transfers, tax advice, and investment
  advice are out of scope until explicit approval gates are passed.

