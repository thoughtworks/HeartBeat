# RUN HeartBeat Backend

## 1. How to start backend application

RUN backend application

```shell script
cd HearBeat/backend
./gradlew bootRun
```

Health endpoint:
http://localhost:4322/api/v1/health

Swagger address:
http://localhost:4322/api/v1/docs

## 2. How to build docker image and run locally

BUILD docker image backend-spring:v1

```shell script
cd HearBeat/backend
docker build -f Dockerfile -t backend-spring:v1 .
```

RUN docker image locally using port 4322

```shell script
docker run
docker run -p 4322:4322 -itd backend-spring:v1
```

Then you can use health endpoint to check the app status.

## 3. How to run all tests

```shell script
cd HearBeat/backend
./gradlew clean test
```

## 4. How to run the local environment

```shell script
cd HearBeat/backend
```

### 4.1 Local environment with production 3-party services

```shell script
./gradlew bootRun --args='--spring.profiles.active=local'
```

you can add Run/Debug Configuration in IDEA to achieve the same purpose as this command
