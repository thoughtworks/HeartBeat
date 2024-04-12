# Contributing to Heartbeat

Thank you for your interest in contributing to Heartbeat!

## Contribution Guidelines

We welcome contributions to:

- Add a new feature to the library (guidance below).
- Improve our documentation and add examples to make it clear how to leverage the Heartbeat.
- Report bugs and issues in the project.
- Submit a request for a new feature.
- Improve our test coverage.

### Contributing Features ✨

Heartbeat is designed to provide generic delivery tool to solve problems. Thus, we focus on contributions that can have an impact on a wide range of projects.
Before you contribute a new feature, please submitting an Issue to discuss the feature so that we can weigh in and assist. 

## How to contribute Changes

### Kick-off

- GitHub issue: Raise a GitHub issue, describe what you want to develop; Or find existing issues; And we will follow up with you and label the issue you are contributing.
- Roadmap: Need show what will you do in different phase, it's better to draw a image and paste it in the GitHub issue if possible.
- Timeline: Describe your expectation when it could be done.

### Setup

#### Local run

Refer to [Run Heartbeat](README.md#6-run-heartbeat) to setup and run project locally.

#### Local E2E

Refer to [Setup E2E locally](https://au-heartbeat.github.io/Heartbeat/en/designs/e2e-testing/) to setup and run E2E locally.

### Coding Standard

- 100% Code coverage: whatever you code is about the frontend or backend
- SAST: We are using SonarCloud for static code scanning.   
- E2E: Write E2E case for your Code Biz logic
- Swagger: Keep swagger available for any changes
- Small PR: Submit small PR, if we can't repair within 1 hour we will revert it
- Commit message: format should be`[GitHub Issue][number][backend/frontend]: commit message`, e.g. `[GitHub Issue][1135][frontend]: Support for GitHub Actions pipelines`


### Before Pull Request

Make sure below item passed:
- Local [frontend](README.md#612-how-to-run-unit-tests) / [backend](backend/README.md#3-how-to-run-all-tests) UT
- Reviewers: Code must be reviewed by 2 team members at least
- Local E2E screenshot: Upload the latest E2E result screenshot on the PR. 
- Github actions: Github actions will be executed automatically once you create a PR.


### After PR merged

- Pipelines: Our Buildkite pipeline will run test check and E2E before deploying into our dev environment
- Revert: We will revert your Pull Request if pipeline failed and we could not fix within 1 hour. We will let you know in details.

## License

By contributing, you agree that your contributions will be licensed under an [MIT license](https://opensource.org/licenses/MIT).
