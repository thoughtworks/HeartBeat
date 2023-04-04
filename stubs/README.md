# Stub Service
This is a service for stubbing 3rd party services (Jira, BuildKite, and Github) to facilitate end-to-end testing.

## Tech Stack
We use [stubby4j](https://stubby4j.com/) as stub server to build our services.
all 3rd party services are stubbed within one stub server.

## Run the Stub service
### Run with JAR archive
1. Download the [latest stubby4j version](https://search.maven.org/search?q=g:io.github.azagniotov%20AND%20a:stubby4j)(the JAR archive).
2. Execute the downloaded stubby JAR using the following command:
    ```shell
    java -jar stubby4j-x.x.xx.jar -d <PATH_TO_LOCAL_YAML_CONFIG>
    ```
    Replace PATH_TO_LOCAL_YAML_CONFIG with the path to /Heartbeat/stubs/stubs.yaml.
3. Navigate to the stubbed urls that start with http://localhost:4323/. (e.g. http://localhost:4323/health )

### Run with docker-compose
1. Navigate to the `/Heartbeat/stubs` folder
2. Run the following command:
    ```shell
    docker-compose up -d
    ```
3. Navigate to the stubbed urls start with http://localhost:4323/. (e.g. http://localhost:4323/health)

## Add new stub api
1. Create json file with json response in the `stub/xxx/jsons` folder, `xxx` is the 3rd party server(jira, buildkite or github).
2. Add yaml configuration in `stub/xxx/xxx-stubs.yaml` to map stubbed request and response
3. Create new folder when new 3rd party server is introduced
4. Finally, when creating a PR, please add the tag `[stub]` to the title information, merged to the main branch, which will trigger the redeployment of the mockserver.
