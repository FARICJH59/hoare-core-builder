# HOARE-CodePen → Governed Project Factory Integration Contract

**Provenance:** 2026-10-21  
**Status:** Architecture contract / implementation backlog. This document does not claim that the bridge or provider deployments are already implemented.

## Product requirement

HOARE is a target-agnostic autonomous project-building and governed execution platform. It must support projects such as frontend and full-stack applications, SaaS products, APIs, machine-learning systems, IoT applications, robotics/Physical AI, scientific software, infrastructure automation, energy systems, and custom projects.

The existing HOARE-CodePen editor remains the frontend authoring and preview surface. It is not the authority system and must not become a second execution engine.

## Responsibility boundaries

- **CodePen builder:** collect intent, edit source, render an isolated local preview, display build/admission/deployment status, and submit a versioned project proposal.
- **Project factory:** normalize intent into a project manifest; plan architecture; select/reuse capabilities; generate artifacts; coordinate build/test/repair; maintain project lifecycle.
- **HOARE-CORE / AEGIS:** remain authoritative for identity, tenant isolation, policy admission, scoped capabilities, authorization, state/version checks, and consequential execution decisions.
- **Execution adapters:** translate an admitted request into target-specific operations. Adapters do not grant themselves authority and do not bypass admission.
- **Evidence and audit:** bind request, manifest version, policy/admission result, build/test evidence, execution result, target identifiers, and actor to a traceable project lifecycle.

Do not create a parallel policy engine, tenant authority, or general-purpose executor in the builder.

## Project manifest (proposed contract)

The browser submits a proposal, not trusted authority fields. The server derives the authenticated tenant and actor from verified credentials.

Required concepts:

- `schemaVersion`
- `projectId` and immutable `projectVersion`
- `projectType` (for example `web-app`, `saas`, `ml`, `iot`, `robotics`, `scientific`, `infrastructure`, `energy`, `custom`)
- `intent` and validated requirements
- `source` / artifact references and content digests
- `buildProfile` (language, framework, build/test commands, declared dependencies)
- `target.kind` and target capabilities
- `policyProfile` and required evidence
- `lifecycleState`, `stateVersion`, and provenance

The server must not trust a client-supplied `tenantId`, role, approval, AEGIS result, deployment status, or credential. Reject unknown or incompatible schema versions rather than silently weakening validation.

## Provider-neutral target model

A tenant can select a supported target, subject to capability and policy checks:

- local development / Termux runner
- Cloudflare edge/web workloads
- AWS
- Google Cloud
- Kubernetes or customer-managed infrastructure
- bare-metal and supported edge hardware
- additional providers through explicit adapters

A target selector is a request, not proof that an adapter or account is ready. The UI must distinguish unavailable, configured, dry-run, admitted, running, succeeded, and failed states. A dry-run result must never be rendered as a live deployment.

The local Termux path is a runner option, not a requirement for the hosted platform. Prefer an explicitly enrolled, outbound-connected runner with scoped, expiring grants; do not expose a phone shell or open inbound port as a general execution API.

## Required execution sequence

1. Authenticate the actor and resolve the tenant on the server.
2. Validate and version the project proposal and selected target.
3. Plan the build and discover required capabilities.
4. Generate or modify artifacts in an isolated workspace.
5. Run static checks, tests, dependency/security checks, and project-specific validation.
6. Submit consequential actions to the existing HOARE-CORE / AEGIS admission boundary.
7. Bind the admitted action to project version, authoritative state version, scoped capability, expiry, and idempotency key.
8. Invoke only the registered adapter that supports the admitted target and action.
9. Collect signed/traceable build and execution evidence; report actual result, not intention.
10. Permit repair or redeployment only as a new versioned action subject to the applicable admission and authorization.

Generation, preview, planning, diagnosis, and passing tests do not themselves authorize deployment. Production changes and physical-system actions require the appropriate fresh authorization.

## Security requirements

- Keep cloud credentials and signing secrets out of browser code, generated source, logs, manifests, and model prompts.
- Do not let project-generated code execute in the trusted server process.
- Keep preview isolated from the parent application; use restrictive sandboxing and a deliberate content-security policy.
- Treat source files, dependencies, prompts, model output, and external build logs as untrusted inputs.
- Enforce tenant isolation server-side for projects, artifacts, runner assignments, logs, and evidence.
- Apply least privilege, scoped capabilities, expiry, revocation, fail-closed behavior, and audit records.
- Treat rollback, repair, and retry as potentially consequential operations; enforce authorization and idempotency.
- Never mark a UI badge “AEGIS verified” unless a verifiable admission result exists for the exact action and project version.

## Minimum conformance tests

1. Tenant identity is derived from verified authentication, not request JSON.
2. Cross-tenant project, artifact, runner, and evidence access is denied.
3. An unauthenticated or unauthorized build/deploy request fails closed.
4. A preview can run without being described as admitted or deployed.
5. Dry-run adapters cannot return a live-success status.
6. Unsupported target capabilities block execution.
7. Stale project/state versions and expired/revoked grants are rejected.
8. Duplicate requests with the same idempotency key do not duplicate consequential execution.
9. Every admitted execution result is linked to provenance and evidence.
10. The same project manifest can be planned for multiple supported targets without embedding provider-specific logic in HOARE-CORE.

## Implementation order

1. Keep the editor and preview usable; label preview accurately.
2. Define and validate the project manifest and versioning contract.
3. Trace the existing authenticated HOARE API and admission path; reuse it rather than inventing another authority.
4. Add a proposal/status API that cannot execute deployment by itself.
5. Connect a single end-to-end dry-run adapter with conformance tests.
6. Add a local runner protocol and then provider adapters incrementally.
7. Enable live execution only after authorization, evidence, revocation, and adapter conformance tests pass.

## Current verified limitation

The inspected CodePen app is an editor with an iframe preview. Its source did not demonstrate a HOARE-CORE authorization call. The inspected `tech-fusion-grid-ui` provider registry used dry-run adapters for Google Cloud, bare-metal, and edge; its deployment endpoint described planning rather than live execution. These facts are the baseline for implementation, not a claim that other repositories or deployment environments have no additional functionality.
