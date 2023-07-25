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

## 4. Run the e2e environment
```shell script
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=e2e'
```

## 5. How to run the local environment
```shell script
cd HearBeat/backend
```

### 5.1 Local environment with production 3-party services
```shell script
./gradlew bootRun --args='--spring.profiles.active=local' 
```
### 5.2 Local environment with online mock server
```shell script
./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=${MOCK_SERVER_IP}:${MOCK_SERVER_PORT}'
```
The values of MOCK_SERVER_IP and MOCK_SERVER_PORT are defined in group file.
For example:
```shell script
./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://MOCK_SERVER_IP:4323'
```
### 5.3 Local environment with local mock server
```shell script
./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323' 
```

you can add Run/Debug Configuration in IDEA to achieve the same purpose as this command

