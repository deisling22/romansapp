# Upgrade Plan: speiseplan-backend (20260717121959)

- **Generated**: 2026-07-17 12:19:59
- **HEAD Branch**: master
- **HEAD Commit ID**: d9fbbdb

## Available Tools

**JDKs**
- JDK 21.0.2: /Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home (base JDK, used by Step 2 baseline)
- JDK 25: **<TO_BE_INSTALLED>** (required by Steps 3, 5 — target version)

**Build Tools**
- Maven Wrapper (mvnw): 3.9.16 — `/Users/romandeisling/Downloads/dev/romansapp/backend/mvnw` (no standalone Maven; wrapper used for all commands)

> Maven 3.9.x does not gate JDK compatibility — it is compatible with Java 25.

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260717121959
- Run tests before and after the upgrade: true

## Upgrade Goals

- **Java**: 21 → 25 (latest LTS as of 2026-07-17)

## Technology Stack

| Technology/Dependency      | Current              | Min Compatible | Why Incompatible                                          |
| -------------------------- | -------------------- | -------------- | --------------------------------------------------------- |
| Java                       | 21                   | 25             | User requested (latest LTS)                               |
| Spring Boot                | 4.1.0                | 3.3+           | Compatible with Java 25 — no changes required             |
| Maven Wrapper              | 3.9.16               | 3.8+           | Compatible with Java 25 — no changes required             |
| maven-compiler-plugin      | (managed by SB 4.x)  | 3.11+          | Managed by Spring Boot parent; compatible                 |
| maven-surefire-plugin      | (managed by SB 4.x)  | 3.0+           | Managed by Spring Boot parent; compatible                 |
| spring-boot-starter-data-jpa | BOM-managed        | —              | Compatible                                                |
| spring-boot-starter-webmvc | BOM-managed          | —              | Compatible                                                |
| postgresql                 | BOM-managed          | —              | Compatible                                                |
| h2                         | BOM-managed          | —              | Compatible                                                |
| flyway-database-postgresql | BOM-managed          | —              | Compatible                                                |
| Docker base image (build)  | maven:3.9.9-eclipse-temurin-21 | — | Must match target JDK (Java 25)                           |
| Docker base image (runtime)| eclipse-temurin:21-jre | —            | Must match target JDK (Java 25)                           |

## Derived Upgrades

- **Dockerfile base images** → Must be updated to Java 25 variants to match the upgraded `<java.version>` property. The Dockerfile uses `maven:3.9.9-eclipse-temurin-21` (build) and `eclipse-temurin:21-jre` (runtime). These must reference Java 25 images so the deployed artefact runs on the target JDK.

## Impact Analysis

### Dependency Changes

| File       | Dependency       | Current | Action  | Target | Reason                  |
| ---------- | ---------------- | ------- | ------- | ------ | ----------------------- |
| pom.xml    | java.version     | 21      | upgrade | 25     | User requested          |

### Source Code Changes

No source code changes required. The codebase has no usage of internal JDK APIs, `sun.misc.*`, `setAccessible` on JDK internals, or `SecurityManager` that would be affected by the Java 21→25 upgrade.

### Configuration Changes

No configuration changes required in `application.yml`.

### CI/CD Changes

| File                   | Location      | Current                                | Required Change                                  |
| ---------------------- | ------------- | -------------------------------------- | ------------------------------------------------ |
| backend/Dockerfile     | Line 1        | `FROM maven:3.9.9-eclipse-temurin-21 AS build` | Change to: `FROM maven:3.9-eclipse-temurin-25 AS build` |
| backend/Dockerfile     | Line 11       | `FROM eclipse-temurin:21-jre`          | Change to: `FROM eclipse-temurin:25-jre`         |

> Note: `render.yaml` deploys via Docker (dockerfilePath), so updating the Dockerfile covers the production deployment automatically. No changes to `render.yaml` are needed.

### Risks & Warnings

- **No test classes present**: The project has test-scope dependencies but zero test class files (`src/test/java/` is empty). Baseline and final test pass rate will both be 0/0. This is not a regression risk for the upgrade itself, but it means runtime-only issues (if any) won't be caught by automated tests.
- **Docker image tag availability**: `maven:3.9-eclipse-temurin-25` and `eclipse-temurin:25-jre` tags rely on Eclipse Temurin publishing Java 25 images (Java 25 LTS was released September 2025). These images are expected to be available; if a specific minor tag (e.g., `3.9.9`) is unavailable for Java 25, the floating minor tag (`3.9`) is used instead.

## Upgrade Steps

- **Step 1: Setup Environment**
  - **Rationale**: JDK 25 is required to compile and run the project after the upgrade. It is not currently installed on the system.
  - **Changes to Make**: Install JDK 25 via `appmod-install-jdk`.
  - **Verification**: `#appmod-list-jdks` confirms JDK 25 is available. Expected: JDK 25 path returned.

- **Step 2: Setup Baseline**
  - **Rationale**: Establish baseline build and test state with current JDK 21 before any changes.
  - **Changes to Make**: None (read-only step).
  - **Verification**: `./mvnw clean compile test-compile -q && ./mvnw clean test -q` with JDK 21. Expected: compiles successfully; 0 tests (no test classes).

- **Step 3: Upgrade Java Source Level to 25**
  - **Rationale**: Update the `java.version` property in `pom.xml` so the Maven compiler plugin targets Java 25 bytecode. This is the core upgrade change.
  - **Changes to Make**: Dependency Changes — `java.version` 21 → 25 in `pom.xml`.
  - **Verification**: `./mvnw clean test-compile -q` with JDK 25. Expected: `BUILD SUCCESS`.

- **Step 4: Update Dockerfile to Java 25**
  - **Rationale**: The Docker build and runtime images still reference Java 21. Updating them ensures the container runtime matches the compiled bytecode level.
  - **Changes to Make**: CI/CD Changes — update both `FROM` lines in `backend/Dockerfile` per Impact Analysis.
  - **Verification**: Review Dockerfile content. Build compilation check with `./mvnw clean test-compile -q` (Dockerfile build is done at deploy time). Expected: `BUILD SUCCESS`.

- **Step 5: CVE Validation & Fix**
  - **Rationale**: Validate that no known CVEs exist in the direct dependencies after the upgrade.
  - **Changes to Make**: Fix any CVEs reported by the CVE scanner by upgrading affected dependency versions.
  - **Verification**: Re-scan with `#appmod-validate-cves-for-java` returns no critical/high CVEs.

- **Step 6: Final Validation**
  - **Rationale**: Confirm all upgrade goals are met, clean rebuild and full test suite with JDK 25.
  - **Changes to Make**: Resolve any remaining TODOs/workarounds.
  - **Verification**: `./mvnw clean test -q` with JDK 25. Expected: `BUILD SUCCESS`, 0 tests (no test classes, consistent with baseline).
