---
title: Sequence Diagram
description: Sequence Diagram
layout: ../../../layouts/MainLayout.astro
---

## C3 - Generate Report

```plantuml
@startuml
skin rose
title C3 - Heartbeat - Generate Report
participant Frontend
participant GenerateReportController
participant GenerateReporter_service
participant JiraService
participant BuildKiteService
participant GithubService
participant JiraFeignClient
participant BuildKiteFeignClient
participant KeyMetricService
group Generate report
Frontend -> GenerateReportController: request report with configuration
activate GenerateReportController
GenerateReportController -> GenerateReporter_service: get analysis report
activate GenerateReporter_service
group fetch jira board data
GenerateReporter_service -> JiraService: get columns, story points and cycle time
activate JiraService
par
  JiraService -> JiraFeignClient: get Jira raw data for all done cards
  activate JiraFeignClient
  JiraFeignClient --> JiraService:
  deactivate JiraFeignClient
  loop card from all done cards
    JiraService -> JiraFeignClient: get card activity fee
    activate JiraFeignClient
    JiraFeignClient --> JiraService
    deactivate JiraFeignClient
  end
  JiraService -> JiraService: Calculate CycleTime for done cards
else
  JiraService -> JiraFeignClient: get Jira raw data for non done cards
  note left
    Is it really necessary for imcomplete cards
  end note
  activate JiraFeignClient
  JiraFeignClient --> JiraService:
  deactivate JiraFeignClient
  loop card from all non done cards
    JiraService -> JiraFeignClient: get card activity fee
    activate JiraFeignClient
    JiraFeignClient --> JiraService
    deactivate JiraFeignClient
  end
  JiraService -> JiraService: Calculate CycleTime for done cards
else
  JiraService -> JiraFeignClient: get Jira columns by board Id
  activate JiraFeignClient
  JiraFeignClient --> JiraService:
  deactivate JiraFeignClient
  loop column from columns
    JiraService -> JiraFeignClient: get column status
    activate JiraFeignClient
    JiraFeignClient --> JiraService
    deactivate JiraFeignClient
  end
end

JiraService --> GenerateReporter_service: return columns, story points and cycle time


deactivate JiraService
end

GenerateReporter_service --> GenerateReporter_service: calculate Velocity
GenerateReporter_service --> GenerateReporter_service: calculate CycleTime
GenerateReporter_service --> GenerateReporter_service: calculate Classification

group fetch BuildKite data
GenerateReporter_service -> BuildKiteService: get pipeline builds and count deploy times
activate BuildKiteService
loop pipeline from pipelines

  BuildKiteService -> BuildKiteFeignClient: get BuildKite builds
  activate BuildKiteFeignClient
  BuildKiteFeignClient --> BuildKiteService:
  deactivate BuildKiteFeignClient

  BuildKiteService -> BuildKiteService: Count deploy times
end

BuildKiteService --> GenerateReporter_service: return pipeline builds and count deploy time

deactivate BuildKiteService
end

GenerateReporter_service --> GenerateReporter_service: calculate Deployment frequency
GenerateReporter_service --> GenerateReporter_service: calculate change failure rate
GenerateReporter_service --> GenerateReporter_service: calculate mean time to recovery

group fetch github data

deactivate GithubService
GenerateReporter_service -> GithubService: get pipeline lead time by deploy times
activate GithubService

loop commit from buildKite by ID
  par
    GithubService -> GitHubFeignClient: get pull request list info by deploy ID
    activate GitHubFeignClient
    GitHubFeignClient --> GithubService:
    deactivate GitHubFeignClient
  else
    GithubService -> GitHubFeignClient: get commits info data by commit ID
    activate GitHubFeignClient
    GitHubFeignClient --> GithubService:
    deactivate GitHubFeignClient
  end
  GithubService -> GitHubFeignClient: get pull request commits data
  activate GitHubFeignClient
  GitHubFeignClient --> GithubService:
  deactivate GitHubFeignClient
  deactivate GitHubFeignClient
end

GithubService --> GenerateReporter_service: return pipeline data for lead time
deactivate GithubService
end

GenerateReporter_service --> GenerateReporter_service: calculate Lead time
GenerateReporter_service --> GenerateReportController: return analysis report
deactivate GenerateReporter_service
GenerateReportController --> Frontend: return response
deactivate GenerateReportController
end
@enduml
```