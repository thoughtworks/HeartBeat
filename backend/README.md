# RUN HeartBeat Backend

## 1. How to start backend application

RUN backend application

```shell script
cd HearBeat/backend
./gradlew bootRun
```

Health endpoint:
http://localhost:3001/actuator/health

Swagger address:
http://localhost:3001/swagger-ui/index.html

## 2. How to build docker image and run locally

BUILD docker image backend-spring:v1
```shell script
cd HearBeat/backend
docker build -f Dockerfile -t backend-spring:v1 .
```
RUN docker image locally using port 3001
```shell script
docker run
docker run -p 3001:3001 -itd backend-spring:v1 
```
Then you can use health endpoint to check the app status.