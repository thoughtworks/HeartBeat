FROM openjdk:19
VOLUME /tmp
ARG DEPENDENCY=build/libs
COPY ${DEPENDENCY}/heartbeat-backend-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","app.jar"]