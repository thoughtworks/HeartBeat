# RUN HeartBeat FrontEnd

## 1. How to start

```
cd HearBeat/frontend
pnpm install
pnpm start

cd HearBeat/backend
./gradlew bootRun

```

## 2. How to run unit test and view test coverage

```
cd HearBeat/frontend
pnpm coverage


cd HearBeat/frontend/coverage/lcov-report/index.html
open index.html
```

## 3. How to run e2e test

1. Start the backend service

```
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

2. Start the frontend service

```
cd HearBeat/frontend
pnpm start
```

3. Run the e2e tests

```
cd HearBeat/frontend
pnpm e2e:local
```

## 4. Code development specification

1. Style naming starts with 'Styled' and distinguishes it from the parent component

```
export const StyledTypography = styled(Typography)({
  fontSize: '1rem',
})
```

2. Css units should use rem:

```
export const StyledTypography = styled('div')({
  width: '10rem',
})
```

3. Write e2e tests using POM design pattern

```
page.cy.ts:
  get headerVersion() {
    return cy.get('span[title="Heartbeat"]').parent().next()
  }


test.cy.ts:
  homePage.headerVersion.should('exist')


```
