# Playwright API Testing Framework (TypeScript)

## 📌 Project Overview
This repository contains an automated API testing framework built with **Playwright** and **TypeScript**.

**Context:** This project was developed as part of a **Udemy course** to master API automation techniques using Playwright.

## 🛠 Tech Stack
-   **Core:** Playwright, TypeScript, Node.js
-   **Validation:** Ajv (JSON Schema validation)
-   **Utilities:**
    -   `@faker-js/faker` for dynamic data generation
    -   `dotenv` for environment management
-   **Reporting:** Playwright HTML & List Reporters

## 🚀 Key Features & Patterns implemented
This framework implements several robust design patterns and practices:

1.  **Fluent API Request Builder**: A custom `RequestHandler` class allows for chaining methods to build requests readably (e.g., `.path(...).params(...).getRequest()`).
2.  **JSON Schema Validation**: Automated response validation using `Ajv` and stored JSON schemas in `response-schemas/`.
3.  **Custom Expect Matchers**: Extended Playwright's `expect` with domain-specific assertions like `shouldMatchSchema` and `shouldEqual`.
4.  **Dynamic Data**: Request payloads are generated dynamically using Faker to ensure test independence.
5.  **Dependency Injection**: Utilizes Playwright fixtures to inject the `api` helper into tests seamlessly.

## 🧠 Technical Deep Dive

### 1. Authentication & Fixtures
-   **Worker-Scoped Auth**: To optimize performance, authentication is handled via a **worker-scoped fixture** (`authToken`) in `utils/fixtures.ts`. This ensures the expensive login operation runs only once per worker process, not before every test.
-   **Dependency Injection**: The `api` fixture initializes the `RequestHandler` with the pre-fetched `authToken` and a fresh `APILogger` for each test, ensuring strict isolation.

### 2. Advanced Validation & Logging
-   **Schema Validation**: Implemented using `Ajv` and `genson-js`. The `validateSchema` function supports **auto-generation** of schemas from responses (via a flag), making it easier to maintain schemas as the API evolves.
-   **Contextual Logging**: The `APILogger` captures full request/response details (URL, headers, body, status). Crucially, these logs are **automatically attached to assertion failures** via the custom matchers, providing instant debugging context without cluttering the console during successful runs.

### 3. Custom Expects Logic
-   **`shouldMatchSchema`**: A custom assertion that integrates deeply with the logger. If validation fails, it throws an error that includes the detailed Ajv validation errors *plus* the recent API logs.
-   **Wrapper Matchers**: Standard assertions like `shouldEqual` are wrapped to catch failures and append the API logs, ensuring that *any* test failure provides the necessary network context.

## 📂 Project Structure
```text
├── tests/              # Test specifications
├── utils/              # Core framework utilities (RequestHandler, Custom Expects)
├── response-schemas/   # JSON schemas for validation
├── request-objects/    # JSON payloads for requests
├── helpers/            # Helper scripts (e.g., token generation)
├── api-test.config.ts  # Environment configuration
└── playwright.config.ts # Main Playwright config
```

## ⚡️ Quick Start

### Installation
```bash
npm install
```

### Running Tests
| Action | Command |
| :--- | :--- |
| **Run All Tests** | `npx playwright test` |
| **Run API Tests** | `npx playwright test --project=api-testing` |
| **Run Smoke Tests** | `npx playwright test --project=api-smoke-tests` |
| **View Report** | `npx playwright show-report` |

## 📝 Notes
-   **Environment**: The framework supports switching environments (e.g., `dev`, `qa`) via `.env` variables.
