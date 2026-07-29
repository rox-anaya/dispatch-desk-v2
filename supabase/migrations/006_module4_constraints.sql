-- Module 4: Migration 6
-- Adds unique constraints so import scripts can safely upsert instead of
-- insert — re-running an import (e.g. after an updated CSV) won't create
-- duplicate rows.

alter table public.runways
  add constraint runways_airport_ident_unique unique (airport_id, ident);

  alter table public.navaids
    add constraint navaids_ident_type_unique unique (ident, type);

    comment on constraint navaids_ident_type_unique on public.navaids is
      'Simplification: assumes no two navaids share both ident and type. Rare edge case (duplicate VOR idents in different regions) is accepted as known technical debt — see MODULE_REPORT.md.';
      