FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /workspace

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

# The extracted layout (thin jar + lib/) starts with far less CPU than the nested fat jar.
RUN chmod +x mvnw && ./mvnw -q -DskipTests package \
    && java -Djarmode=tools -jar target/speiseplan-backend-0.0.1-SNAPSHOT.jar extract --destination extracted

FROM eclipse-temurin:25-jre
WORKDIR /app

COPY --from=build /workspace/extracted/ ./

ENV PORT=8080
# TieredStopAtLevel=1: on the 0.1-CPU free instance the optimizing compiler costs more CPU than it
# saves before the instance sleeps again; C1 only halves the CPU needed to start and per request.
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -Xss512k -XX:+ExitOnOutOfMemoryError -XX:TieredStopAtLevel=1"
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/speiseplan-backend-0.0.1-SNAPSHOT.jar"]
