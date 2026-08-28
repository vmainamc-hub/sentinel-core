# PRECISIONFORGE12 freeze and reliability repair

## Confirmed audit findings

- `ApexCore.analyse()` is already the live Sentinel producer, but `useApexSentinel` calls `rankOpportunities()` every second and `rankOpportunities()` maps every market and calls `observationEngine.ingest()` again. Ranking also attempts qualification. A UI refresh therefore advances Sentinel state, confirmation counters, persistence, and potentially backend writes.
- `mapIntelToObservationInputs()` is a heavyweight analytical boundary, not a mapper: it slices/reprocesses history, computes pressure and price-action fields, runs spine/regime/Markov/calibration/setup/clearance/governance logic, scans simulator history, and calls EntryLab recommendations per contract. Running it from ranking duplicates the core workload.
- `EntryLab.recommend()` rescans the entire capped ledger and rebuilds statistics for all rules on every call. The adapter calls it more than once per contract.
- `losingDigitExposure()` rescans the same deep digit history for each losing digit and each contract, including nested burst-history scans and longest-run scans.
- The shared public tick bus is conceptually correct, but history requests have no `req_id`; responses are accepted only through `echo_req`, catch-up is sent every 2.5 seconds without per-symbol pending/cooldown state, and socket handlers do not reject events from replaced sockets. This permits unbounded repeated history work and stale-socket reconnect races.
- The repository contains additional authenticated Deriv sockets for account/trading operations; these are legitimate separate connections, but their request queues and pending maps need bounded cleanup and stale-socket guards.
- Sentinel persistence is asynchronous, but every active dossier ingestion schedules local serialization and may schedule cloud work. Duplicate ingestion amplifies both. Backend failure is swallowed in one adapter and only partly surfaced elsewhere.
- Environment names are mostly separated correctly (`VITE_*` publishable client values; unprefixed server values), and no real `.env` was included. The example includes unused project-ID aliases and the generated clients silently substitute placeholders, which obscures misconfiguration. No secret values will be invented or logged.
- Baseline tests could not start from the uploaded archive because dependencies/lockfile were absent; the test command failed while resolving `vitest/config`. This will be re-run after importing the repository and installing its declared dependencies.

## Phase 1 — establish the authoritative pipeline

- Import the supplied application without `.git` metadata and preserve all existing engines, routes, thresholds, formulas, vetoes, and qualification rules.
- Add deterministic source identity to each market analysis (`market + proposition + source tick timestamp/id + analysis version`).
- Make `ApexCore` the sole live producer of mapped Sentinel observations.
- Make `rankOpportunities()` read-only: remove mapping, ingestion, and qualification mutation from ranking; consume immutable Sentinel dossiers/qualification snapshots already produced by the core.
- Add duplicate and out-of-order rejection inside `ObservationEngine` as defense in depth, with counters for accepted, duplicate, and stale observations.

## Phase 2 — canonical snapshot and computation reuse

- Introduce an immutable per-market analysis snapshot/version owned by `ApexCore`, containing the shared tick/digit histories and already-computed market features.
- Split `mapIntelToObservationInputs()` into shared per-snapshot preparation and contract-specific projection; cache by actual source identity rather than elapsed time.
- Add EntryLab ledger versions and per-market/contract statistics caches; invalidate only affected keys when trades resolve, configuration changes, or the ledger is pruned/reset.
- Precompute losing-digit history features once per market snapshot and reuse them across contracts, preserving every current formula and threshold.
- Remove avoidable repeated slices, simulator exports, and history conversions while retaining output equivalence tests.

## Phase 3 — WebSocket reliability

- Add monotonic `req_id` correlation and pending-request metadata for seed/catch-up history; resolve symbol from correlation first and use response symbol/`echo_req` only as validated fallbacks.
- Allow only one pending history request per symbol/type, add bounded cooldown/backoff, clear pending requests on response/timeout/socket replacement, and prevent quiet symbols from producing catch-up loops.
- Add socket-generation guards so old sockets cannot update buffers, status, subscriptions, or reconnect state after replacement.
- Make reconnect/handshake/watchdog timers single-owner and observable; preserve reference-counted subscriptions and authenticated trading sockets.
- Expose connection state, last message/tick/history times, pending request count, reconnect count, and buffer sizes.

## Phase 4 — responsiveness, fail-safe state, and telemetry

- Measure analysis, mapping, Sentinel ingest, ranking, persistence, and UI sampling durations with bounded sampled diagnostics rather than per-tick logging.
- Publish one immutable result snapshot to React; render from it without analytical side effects. Memoize the 90-cell presentation so unchanged cells do not rebuild.
- Add explicit `LIVE`, `ANALYZING`, `ANALYSIS LAG`, `FEED STALE`, `ENGINE BUSY`, `BACKEND DEGRADED`, and `NO QUALIFIED SIGNAL` states; stale signals cannot appear current.
- Keep cloud persistence beside—not inside—the critical market-analysis path, add request timeout/backoff and visible degradation state.
- Profile after deduplication/caching. If any market analysis chunk still exceeds the responsiveness budget, move only the heavy pure snapshot computation into a bounded latest-value-wins worker while preserving chronological Sentinel ingestion on one authoritative stream.

## Phase 5 — environment cleanup

- Enable Lovable Cloud for the imported app’s existing authentication/persistence features and apply its existing schema safely.
- Validate required client and server configuration separately and fail clearly instead of constructing placeholder backend clients.
- Keep only source-used variables in `.env.example`; document `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as public client configuration, and `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `LOVABLE_API_KEY` as server/runtime values where actually used.
- Verify no service-role/secret value is reachable from the browser bundle or diagnostic output. Invalid backend configuration must degrade persistence/auth without stopping Deriv analysis.

## Phase 6 — regression and stress verification

- Add focused tests for pure repeated ranking, exactly-once legitimate ingestion, deterministic duplicate/out-of-order rejection, React rerender immutability, EntryLab and exposure cache invalidation, bounded 1,000/5,000-tick work, socket generation safety, reconnect subscription uniqueness, history correlation without `echo_req`, watchdog cooldown, backend isolation, stale UI state, and bounded worker/analysis queues.
- Run lint, TypeScript checks, the complete unit suite, and production build after dependency installation.
- Run a 5–10 minute deterministic multi-market stress harness with realistic tick cadence, recording CPU/event-loop lag, heap/buffer trends, analysis percentiles, observation counts, queue depth, reconnect/history counts, and backend errors.
- Compare analytical outputs before/after on fixed histories to prove the optimization changed scheduling and reuse—not mathematical meaning.

## Deliverable

Provide a technical report with root causes, changed files, Sentinel/WebSocket/performance/environment changes, tests and results, measured before/after observations, and remaining risks. Any optimization that changes analytical output will be withheld and documented for explicit approval.
