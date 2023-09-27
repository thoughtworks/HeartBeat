---
title: How to start e2e test in local environment
layout: ../../../layouts/MainLayout.astro
---

**Solution**

- In the stubs directory, start docker.
  ```
  docker-compose up -d
  ```
- In the backend directory, start backend.
  ```
  ./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'
  ```
- In the frontend directory, start frontend.
  ```
  pnpm start
  ```
- In the frontend directory, start cypress.
  ```
  pnpm cypress open
  ```
