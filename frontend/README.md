# RUN HeartBeat FrontEnd

## 1. How to start

```
cd HearBeat/frontend
pnpm install
pnpm start

cd HearBeat/backend
./gradlew bootRun

```

## 2. How to run test and view test coverage

```
cd HearBeat/frontend
pnpm coverage


cd HearBeat/frontend/coverage/lcov-report/index.html
open index.html
```

## 3. Code development specification

1. Style naming starts with 'Styled' and distinguishes it from the parent component

```
export const StyledTypography = styled(Typography)({
  fontSize: '1rem',
})
```

2. css units should avoid using decimals eg:

```
export const StyledTypography = styled(Typography)({
  // fontSize: '0.88rem',
  fontSize: '14px',
})
```
