# Contributing to the Project

Thank you for considering contributing to our project! We welcome contributions from the community and are grateful for your support. This document provides guidelines on how to contribute to the project, including coding standards, testing procedures, and the process for submitting pull requests.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Coding Standards](#coding-standards)
3. [Code Formatting Guidelines](#code-formatting-guidelines)
4. [Testing Procedures](#testing-procedures)
5. [Submitting Pull Requests](#submitting-pull-requests)
6. [Code of Conduct](#code-of-conduct)

## Getting Started

To get started with contributing to the project, follow these steps:

1. Fork the repository to your GitHub account.
2. Clone the forked repository to your local machine.
3. Create a new branch for your changes.
4. Make your changes in the new branch.
5. Commit your changes with clear and descriptive commit messages.
6. Push your changes to your forked repository.
7. Create a pull request to the main repository.

## Coding Standards

To ensure consistent code quality and maintainability, please follow these coding standards:

- Use ESLint and Prettier for consistent code formatting. The repository includes configuration files for these tools (`.eslintrc.json` and `.prettierrc`).
- Add type annotations to Python code to improve code quality and readability.
- Ensure that all functions and classes have docstrings to provide clear explanations of their purpose and usage.
- Follow the existing code style and conventions used in the project.

## Code Formatting Guidelines

To ensure consistent code formatting in the repository, follow these guidelines:

- Use ESLint and Prettier for consistent code formatting. The repository includes configuration files for these tools (`.eslintrc.json` and `.prettierrc`).
- Add a pre-commit hook to automatically run ESLint and Prettier on staged files before each commit. This is configured using Husky and lint-staged.
- Configure your IDE or code editor to use the ESLint and Prettier settings from the repository. This will help maintain consistent formatting while writing code.
- Regularly run ESLint and Prettier on the entire codebase to ensure all files adhere to the defined formatting rules.
- For Python code, use Black for code formatting. The repository includes a configuration file for Black (`pyproject.toml`).
- Document the code formatting guidelines in the `CONTRIBUTING.md` file to guide new contributors on the project's coding standards.

## Testing Procedures

To maintain a high level of code quality, please follow these testing procedures:

- Write tests for any new functionality or changes to existing functionality.
- Ensure that all critical functionality is covered by tests.
- Use the existing test files (`Backend/tests/test_app.py`, `Backend/tests/test_csp.py`, and `Backend/tests/test_model.py`) as examples for writing new tests.
- Run all tests locally before submitting a pull request to ensure that they pass.

## Submitting Pull Requests

To submit a pull request, follow these steps:

1. Ensure that your changes are based on the latest version of the main branch.
2. Create a pull request with a clear and descriptive title and description of your changes.
3. Include any relevant issue numbers in the pull request description.
4. Ensure that all tests pass and that your changes do not introduce any new issues.
5. Be responsive to any feedback or requests for changes from the project maintainers.

## Code of Conduct

We are committed to fostering a welcoming and inclusive community. Please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) when participating in the project.

Thank you for your contributions!
