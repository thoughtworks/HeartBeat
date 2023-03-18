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
http://localhost:4322/api/v1/swagger-ui/index.html

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

## 4. Run the e2e environment
```shell script
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=e2e'
```
