# Heartbeat Project（2023/07）

[![Build status](https://badge.buildkite.com/62f2d9def796f9bf8d79dc67e548341b6e3e3ad07631164b07.svg)](https://buildkite.com/heartbeat-backup/heartbeat)[![Codacy Badge](https://app.codacy.com/project/badge/Grade/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Grade)[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Coverage)

[![Docs](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml) [![Frontend](https://github.com/au-heartbeat/HeartBeat/actions/workflows/frontend.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/frontend.yml) [![Backend](https://github.com/au-heartbeat/HeartBeat/actions/workflows/backend.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/backend.yml) [![Security](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Security.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Security.yml) [![Build and Deploy](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B23211%2Fgithub.com%2Fau-heartbeat%2FHeartbeat.svg?type=large)](https://app.fossa.com/projects/custom%2B23211%2Fgithub.com%2Fau-heartbeat%2FHeartbeat?ref=badge_large)


- [Heartbeat Project（2023/07）](#heartbeat-project202307)
- [News](#news)
- [1 About Heartbeat](#1-about-heartbeat)
- [2 Support tools](#2-support-tools)
- [3 Product Features](#3-product-features)
  - [3.1 Config project info](#31-config-project-info)
    - [3.1.1 Config Board/Pipeline/Source data](#311-config-boardpipelinesource-data)
      - [3.1.2 Config search data](#312-config-search-data)
      - [3.1.3 Config project account](#313-config-project-account)
    - [3.2 Config Metrics data](#32-config-metrics-data)
      - [3.2.1 Config Crews/Cycle Time](#321-config-crewscycle-time)
      - [3.2.2 Setting Classification](#322-setting-classification)
      - [3.2.3 Setting advanced settings](#323-setting-advanced-setting)
      - [3.2.4 Pipeline configuration](#324-pipeline-configuration)
  - [3.3 Export and import config info](#33-export-and-import-config-info)
    - [3.3.1 Export Config Json File](#331-export-config-json-file)
    - [3.3.2 Import Config Json File](#332-import-config-json-file)
  - [3.4 Generate Metrics Data](#34-generate-metrics-data)
    - [3.4.1 Velocity](#341-velocity)
    - [3.4.2 Cycle Time](#342-cycle-time)
    - [3.4.3 Classification](#343-classification)
    - [3.4.4 Deployment Frequency](#344-deployment-frequency)
    - [3.4.5 Lead time for changes Data](#345-lead-time-for-changes-data)
    - [3.4.6 Change Failure Rate](#346-change-failure-rate)
    - [3.4.7 Mean time to recovery](#347-mean-time-to-recovery)
  - [3.5 Export original data](#35-export-original-data)
    - [3.5.1 Export board data](#351-export-board-data)
    - [3.5.2 Export pipeline data](#352-export-pipeline-data)
  - [3.6 Caching data](#36-caching-data)
- [4 Known issues](#4-known-issues)
  - [4.1 Change status name in Jira board](#41-change-status-name-in-jira-board-setting-when-there-are-cards-in-this-status)
- [5 Instructions](#5-instructions)
  - [5.1 Prepare for Jira Project](#51-prepare-for-jira-project)
  - [5.2 Prepare env to use Heartbeat tool](#52-prepare-env-to-use-heartbeat-tool)
- [6 Run Heartbeat](#6-run-heartbeat)
  - [6.1 How to run frontend](#61-how-to-run-frontend)
  - [6.1.1 How to build and local preview](#611-how-to-build-and-local-preview)
  - [6.1.2 How to run unit tests](#612-how-to-run-unit-tests)
  - [6.1.3 How to generate a test report](#613-how-to-generate-a-test-report)
  - [6.1.4 How to run e2e tests locally](#614-how-to-run-e2e-tests-locally)
- [7 How to trigger BuildKite Pipeline](#7-how-to-trigger-buildkite-pipeline)
  - [Release](#release)
    - [Release command in main branch](#release-command-in-main-branch)
- [7 How to use](#7-how-to-use)
  - [7.1 Docker-compose](#71-docker-compose)
    - [7.1.1 Customize story point field in Jira](#711-customize-story-point-field-in-jira)
    - [7.1.2 Multiple instance deployment](#712-multiple-instance-deployment)
  - [7.2 K8S](#72-k8s)
    - [7.2.1 Multiple instance deployment](#721-multiple-instance-deployment)

# News

 - [Feb 28 2023 - Released Heartbeat - 0.9.0](release-notes/20230228.md)
 - [July 27 2023 - Release Heartbeat - 1.0.0](release-notes/20230726.md)
 - [Oct 9 2023 - Release Heartbeat - 1.1.0](release-notes/20231009.md)
 - [Nov 6 2023 - Release Heartbeat - 1.1.2](release-notes/20231106.md)
 - [Nov 21 2023 - Release Heartbeat - 1.1.3](release-notes/20231121.md)
 - [Dev 4 2023 - Release Heartbeat - 1.1.4](release-notes/20231204.md)
 - [Feb 29 2024 - Release Heartbeat - 1.1.5](release-notes/20240229.md)

# 1 About Heartbeat

Heartbeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.


State of DevOps Report is launching in 2019. In this webinar, The 4 key metrics research team and Google Cloud share key metrics to measure DevOps performance, measure the effectiveness of development and delivery practices. They searching about six years, developed four metrics that provide a high-level systems view of software delivery and performance.

**Here are the four Key meterics:**

1.  Deployment Frequency (DF)
2.  Lead Time for changes (LTC)
3.  Mean Time To Recover (MTTR)
4.  Change Failure Rate (CFR)

In Heartbeat tool, we also have some other metrics, like: Velocity, Cycle Time and Classification. So we can collect DF, LTC, CFR, Velocity, Cycle Time and Classification.

For MTTR meter, specifically, if the pipeline stay in failed status during the selected period, the unfixed part will not be included for MTTR calculation.

# 2 Support tools

Here is the user manaul for Version 1 on 2020/06. For now, we just can support Jira/Buildkite/Github to generate the corresponding metrics data.
| Type | Board | Pipeline | Repo |
| ------------- | --------------------- | ---------------------------------------- | -------------------------- |
| Support tools | Jira √ </br> Trello × | Buildkite √ </br>Teamcity × </br> GoCD × | Github √ </br> Bitbucket × |

**Note：** “√” means can support, “×” means can not support

# 3 Product Features

## 3.1 Config project info

### 3.1.1 Config Board/Pipeline/Source data

Before generator the metrics data, user need to config the project info, in Home page (Image3-1), you can create a new project for your project, or you can import a project config json file (If you already saved one config file, for import file feature will introduce in “Import and Export feature ”).

![Image 3-1](https://private-user-images.githubusercontent.com/14356067/308932852-cafbe08b-98f2-4a8b-a4da-7c0bc3da8543.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTM4NjMsIm5iZiI6MTcwOTIxMzU2MywicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzI4NTItY2FmYmUwOGItOThmMi00YThiLWE0ZGEtN2MwYmMzZGE4NTQzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzI0M1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTRiMmNmNTVjNWU3NzM5OGEyMGE2ZTFhMWY0MzIzMDdhYjI1NzRkY2U1YWNlMjk2ZTgwMTllYWQ1ZmQ5NzRiZDUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.DteuPpHLIJt3lGW_SULg1Pwwgsre7v6-KBY67Hy1YCE)\
_Image 3-1，home page_

#### 3.1.2 Config search data

If you are first use the product, you need to select “Create A New Project”，it will go to config page (Image 3-2)

![Image 3-2](https://private-user-images.githubusercontent.com/14356067/308933384-6990ebe9-6a57-45e2-913a-ffc722d8b6b1.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQxMDIsIm5iZiI6MTcwOTIxMzgwMiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzMzODQtNjk5MGViZTktNmE1Ny00NWUyLTkxM2EtZmZjNzIyZDhiNmIxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzY0MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWYxNzA3NTI4N2E5ZTg0OTNhYTI1MjdiOWQ3YWVkZWJmNjdkYTg3NDFhMGFiZjNlNzcyMWI1MTgzNTNmMTllOWQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.vJl5Cx9_T9cq1QCrXotgjPND4AmLa5omOYYUcfcGwGw)\
_Image 3-2，Project config page_

Users need to select a period of time, then all of the data that follows is based on that time period.

**Have two items of time period:**

1.  **Regular Calendar(Weekend Considered):** If you select this item, it means all data will exclude the weekend.
2.  **Calendar with Chinese Holiday:** If you select this item, it means all data will exclude the weekend and Chinese holiday. So if the time period you selected contains Chinese holiday, you need to select this item.

All need to select which data you want to get, for now, we support seven metrics data (Image 3-3). Those seven metrics are `Deployment Frequency (DF)`, `Lead Time for changes (LTC)`, `Mean Time To Recover (MTTR)`, `Change Failure Rate (CFR)`, and `Velocity`, `Cycle time`, `Classification`, where
- `Velocity` : includes how many story points and cards we have completed within selected time period.
- `Cycle time`: the time it take for each card start to do until move to done.
- `Classification`: provide different dimensions to view how much efforts team spent within selected time period.


![Image 3-3](https://private-user-images.githubusercontent.com/14356067/308933544-b274fab8-e656-4514-a375-f9ac693a57cc.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQxMzMsIm5iZiI6MTcwOTIxMzgzMywicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzM1NDQtYjI3NGZhYjgtZTY1Ni00NTE0LWEzNzUtZjlhYzY5M2E1N2NjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzcxM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTQ5MTI2ZjYyYmY0YTEzOGQ3NjU5ZTU2ZWY5YzhmYTIxMGFhMWU0Njc0MmVjOTJkM2ZlNGM5ZDFiMGFjNmY0MTEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.rCrnS6B_PQcVTit_MH4NpQ5YVAKZoleDqK8X3oizxq4)\
_Image 3-3，Metrics Data_

#### 3.1.3 Config project account

Because all metrics data from different tools that your projects use. Need to have the access to these tools then you can get the data. So after select time period and metrics data, then you need to input the config for different tools(Image 3-4).

According to your selected required data, you need to input account settings for the respective data source. Below is the mapping between your selected data to data source.

| Required Data  | Datasource  |
|---|---|
| Velocity  | Board  |
| Cycle time  | Board  |
| Classification  | Board  |
| Lead time for changes  | Repo，Pipeline  |
| Deployment frequency  | Pipeline |
| Change failure rate  | Pipeline  |
| Mean time to recovery  |  Pipeline |


![Image 3-4](https://private-user-images.githubusercontent.com/14356067/308933941-3c49927d-d1db-416b-b140-8e5232189e8c.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQxNzYsIm5iZiI6MTcwOTIxMzg3NiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzM5NDEtM2M0OTkyN2QtZDFkYi00MTZiLWIxNDAtOGU1MjMyMTg5ZThjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzc1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTc2YjRkODIzZDhkN2ZhZDgyYjFhZDJmZmZiYjZmMDY2ZDFjM2UxNjM4YjUxOWQ3OWI4ZDgyNThhZmZjMjlhMTUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.k5mJ44_r_ycmxG4T-9AfT5mHlNbtLQv42fDTymaI68w)\
Image 3-4，Project config

**The details for board:**
|Items|Description|
|---|---|
|Board Type|Support two types of board: Classic Jira and Next-gen Jira|
|Board Id|The value of BoardId is number. You need to find it from your team’s Jira board URL.<br/>For Example: <br/> 1. Your jira board URL like below, then `2` is the boardId <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 <br/> 2. Your jira board URL like below, then rapidView=3, `3` is the boardId <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|ProjectKey|You can find it from your team’s Jira board URL. <br/> For Example: <br/> 1. Your jira board URL like below, then `ADM` is the projectkey <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2<br/> 2. Your jira board URL like below, then projectKey is `KAN1` <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Site|Site is the domain for your jira board, like below URL, `dorametrics` is the site <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 |
|Email|The email can access to the Jira board |
|Token|Generate a new token with below link, https://id.atlassian.com/manage-profile/security/api-tokens |

**The details for Pipeline:**
|Items|Description|
|---|---|
|PipelineTool| The pipeline tool you team use, currently heartbeat only support buildkite|
|Token|Generate buildkite token with below link, https://buildkite.com/user/api-access-tokens|

**The details for SourceControl:**
|Items|Description|
|---|---|
|SourceControl|The source control tool you team use, currently heartbeat only support Github|
|Token|Generate Github token with below link(classic one), https://github.com/settings/tokens|

### 3.2 Config Metrics data

After inputting the details info, users need to click the `Verify` button to verify if can access to these tool. Once verified, they could click the `Next` button go to next page -- Config Metrics page(Image 3-5，Image 3-6，Image 3-7)

#### 3.2.1 Config Crews/Cycle Time

![Image 3-5](https://private-user-images.githubusercontent.com/14356067/308934374-4e7abf81-b5c7-4ce3-a9c1-6c9060fdcb2d.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQyMDksIm5iZiI6MTcwOTIxMzkwOSwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzQzNzQtNGU3YWJmODEtYjVjNy00Y2UzLWE5YzEtNmM5MDYwZmRjYjJkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzgyOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTAyYzYzOGU4OTkyZGJmODcyM2JhZmMxMGIxZjQyNGY5NjA0MGRiOTA5NTkwNDYyMzZkZWRmZWY3NmY1ZmFhY2ImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.hYbg7o_QW7i63P1Ka7DDXIbQhCI63YrYJsc_oYDBfRk)\
_Image 3-5, Crews/Cycle Time config_


**Crew Settings:** You could select your team members from a list get from board source. The list will include the assignees for those tickets that finished in the time period selected in the last step.

**Cycle Time:** It will list all columns for the current active jira board. Then users need to map the each column to the supported columns. Like, if your board have “in progress” column, it means developer doing this ticket, so it should be mapping with “In Dev” for the list we provide.

| Status              | Description                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| To do               | It means the ticket needs to be done, waiting for Dev to pick it. Cycle time doesn't include this time.                                |
| Analysis            | BA or other people still need to analyze the ticket. Cycle time doesn't include this time.                                             |
| In Dev              | It means dev is doing the ticket. This time should be a part of cycle time. And it is named development time.                          |
| Block               | It means the tickets blocked by some issues, cannot be done now. This time should be a part of cycle time. And it is named block time. |
| Waiting for testing | It means waiting for Dev to pick or QA to testing. This time should be a part of cycle time. And it is named waiting time.             |
| Testing             | It means QA is testing the tickets. This time should be a part of cycle time. And it is named testing time.                            |
| Review              | It means PO or other people are reviewing the tickets. This time should be a part of cycle time. And it is named review time.          |
| Done                | It means the tickets are already done. Cycle time doesn't include this time.                                                           |
| --                  | If you don't need to map, you can select --                                                                                            |

#### 3.2.2 Setting Classification

![Image 3-6](https://private-user-images.githubusercontent.com/14356067/308934557-b076c032-a636-4895-8af6-bc4447c5867a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQyNjYsIm5iZiI6MTcwOTIxMzk2NiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzQ1NTctYjA3NmMwMzItYTYzNi00ODk1LThhZjYtYmM0NDQ3YzU4NjdhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzMzkyNlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTE4NDRhZTZjNmRmZTM0ZmUwMjRhZDRiOGFhODk1MzVhN2QyNGE3NWRiYjU1M2YyNjI4MTRmZWY5MDMxNGNmZGQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.qlq_VMFVn5CiBm5r4KbDUI3R70ttCKBSg0Gjd_l4Htw)\
_Image 3-6，Classification Settings_

In classification settings, it will list all Context fields for your jira board. Users can select anyone to get the data for them. And according to your selection, in the export page, you will see the classification report to provide more insight with your board data.

#### 3.2.3 Setting advanced Setting

![Image 3-7](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/advance-settings.png)\
_Image 3-7，advanced Settings_

In advanced settings, it contains story points Input and Flagged Input. Users can input story points and Flagged custom-field on their own when the jira board has permission restriction . And according to these input, in the export page, user can get correct story points and block days

how to find the story points and Flagged custom-field?

![Image 3-8](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/devtool-network.png)\
_Image 3-8，devTool-network-part_

![Image 3-9](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/card-history.png)\
_Image 3-9，card-history_

![Image 3-10](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/find-custom-field-api.png)\
_Image 3-10，find-custom-field-api_

![Image 3-11](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/story-point-custom-field.png)\
_Image 3-11，story-point-custom-field_

![Image 3-12](https://jsd.cdn.zzko.cn/gh/au-heartbeat/data-hosting@main/advanced-setting-image/flagged-custom-field.png)\
_Image 3-12，flagged-custom-field_

1. user need to go to the jira board and click one card , then open dev tool switch to network part. 
2. then click card's history part. 
3. at that time, user can see one api call which headers request URL is https://xxx.atlassian.net/rest/gira/1/ . 
4. then go to review part, find fieldDisplayName which show Flagged and story point estimate and get the fieldId as the custom-field that user need to input in advanced settings. from image 3-11 and 3-12 we can find that  flagged custom field is customfield_10021, story points custom field is customfield_10016. 

#### 3.2.4 Pipeline configuration

![Image 3-13](https://private-user-images.githubusercontent.com/14356067/308934831-cd87bc07-c7cc-4c71-b19c-f73a3df071c2.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQzMTIsIm5iZiI6MTcwOTIxNDAxMiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzQ4MzEtY2Q4N2JjMDctYzdjYy00YzcxLWIxOWMtZjczYTNkZjA3MWMyLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDAxMlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWRmNjFmYTE2YzAwMzk0MDRkMzE2NDdjZTcyNjllOTg1YmFkOGQyMzFkYTE2YmQ3NjY0OWNlNDQwOTY2ZTFmNDgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.H32HxH24gUdkncQwxDSRAbbnhRU5W-5kAwWUcD6pIYw)\
_Image 3-13，Settings for Pipeline_

They are sharing the similar settings which you need to specify the pipeline step so that Heartbeat will know in which pipeline and step, team consider it as deploy to PROD. So that we could use it to calculate metrics.

| Items         | Description                                       |
|---------------|---------------------------------------------------|
| Organization  | The organization for your pipelines               |
| Pipeline Name | Your pipeline name                                |
| Steps         | The pipeline step that consider as deploy to PROD |
| Branches      | Your selected branches                            |

## 3.3 Export and import config info

### 3.3.1 Export Config Json File

When user first use this tool, need to create a project, and do some config. To avoid the user entering configuration information repeatedly every time, we provide a “Save” button in the config and metrics pages. In config page, click the save button, it will save all items in config page in a Json file. If you click the save button in the metrics page, it will save all items in config and metrics settings in a Json file. Here is the json file (Image 3-8)。Note: Below screenshot just contains a part of data.

![Image 3-14](https://user-images.githubusercontent.com/995849/89784710-b4c41180-db4b-11ea-9bc4-db14ce98ef69.png)\
_Image 3-14, Config Json file_

### 3.3.2 Import Config Json File

When user already saved config file before, then you don’t need to create a new project. In the home page, can click Import Project from File button(Image 3-1) to select the config file. If your config file is too old, and the tool already have some new feature change, then if you import the config file, it will get some warning info(Image 3-9). You need to re-select some info, then go to the next page.

![Image 3-15](https://user-images.githubusercontent.com/995849/89784267-f902e200-db4a-11ea-9d0b-a8ab29a8819e.png)\
_Image 3-15, Warning message_

## 3.4 Generate Metrics report

After setup and configuration, then it will generate the heartbeat dashboard.
![Image 3-16](https://private-user-images.githubusercontent.com/14356067/308935360-cde7001c-bc3f-416e-824c-ae3e3a0159ca.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ1ODEsIm5iZiI6MTcwOTIxNDI4MSwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzUzNjAtY2RlNzAwMWMtYmMzZi00MTZlLTgyNGMtYWUzZTNhMDE1OWNhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDQ0MVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTEwOTRkMzA3NzVmMjdhZGQ2MWMxMWQ3NmQ1MTlhZDY0NzQ3ZDNmYzY3MjhhYTk5OWQxNmQ3ZGM4NGU4OGU4NTImWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.OtxyeoKfxCnZIudo-69BWWhpdr1Jp0IWzCgl2VwA-2Q)

You could find the drill down from `show more >` link from dashboard.

### 3.4.1 Velocity

In Velocity Report, it will list the corresponding data by Story Point and the number of story tickets. (image 3-10)
![Image 3-16](https://user-images.githubusercontent.com/995849/90856819-5ef63180-e3b5-11ea-8e94-e5363d305cf1.png)\
_Image 3-16，Velocity Report_

### 3.4.2 Cycle Time

The calculation process data and final result of Cycle Time are calculated by rounding method, and two digits are kept after the decimal point. Such as: 3.567... Is 3.56; 3.564... Is 3.56.

![Image 3-17](https://private-user-images.githubusercontent.com/14356067/308936113-383aa224-e4ae-4be9-8254-ae80c0321fc5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ3NjIsIm5iZiI6MTcwOTIxNDQ2MiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzYxMTMtMzgzYWEyMjQtZTRhZS00YmU5LTgyNTQtYWU4MGMwMzIxZmM1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDc0MlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWU0OGQxM2ZjNTQ4OWYzMmZjZGVmYmQ3Yjc5MDg5Zjk0YzEzM2UwZDNmM2RkZDMzYTc4Mjc4NzI0YzcyMTFmYjQmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.AwOroHyfiU6xQix4X3XKw-e_-N_lsKOIvlMc8ee-oBc)\
_Image 3-17，Cycle Time Report_

### 3.4.3 Classification


It will show the classification data of Board based on your selection on `Classification Settings` in metrics page.
The percentage value represent the count of that type tickets vs total count of tickets.


![Image 3-18](https://private-user-images.githubusercontent.com/14356067/308936419-3cd61946-f653-446d-a8ff-95890634dc73.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ4MzksIm5iZiI6MTcwOTIxNDUzOSwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzY0MTktM2NkNjE5NDYtZjY1My00NDZkLWE4ZmYtOTU4OTA2MzRkYzczLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDg1OVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTk2ODc3NmIzNjlmZDlmOWI0MzdhOGNjNjMwZGQ0ZTI2Njk2NWQwNTAxZGNjZjA2OTY0MWRiM2UzY2VjMzk2MzYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.MJEBkssN_Y7vCkRm73RoZUORL0DTFUBBsXpzECJ3FgU)\
_Image 3-18，Classification Report_

### 3.4.4 Deployment Frequency

![Image 3-19](https://private-user-images.githubusercontent.com/14356067/308936732-1f85e08f-081f-438c-9203-aa7020a1c795.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ4NjcsIm5iZiI6MTcwOTIxNDU2NywicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzY3MzItMWY4NWUwOGYtMDgxZi00MzhjLTkyMDMtYWE3MDIwYTFjNzk1LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDkyN1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE2YTk0Y2U5ZjFjYzhmMzNiNDc2MDY3YzM1NjEzNzllMDBhZDNmODM4MDY1ZjMzNDE1ZDhkMjZmZWRkYmZmMWEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.e0HcNHYCAdtpxEDuq2cjDFVg5sEcnj6EYWVeBXhx7s0)\
_Image 3-19，Deployment Frequency Report_

### 3.4.5 Lead time for changes Data

![Image 3-20](https://private-user-images.githubusercontent.com/14356067/308936861-57952daf-e288-4967-b022-cb7466606333.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ4OTYsIm5iZiI6MTcwOTIxNDU5NiwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzY4NjEtNTc5NTJkYWYtZTI4OC00OTY3LWIwMjItY2I3NDY2NjA2MzMzLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNDk1NlomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTdmNTI1YjFlODZmODE2N2VhYjhhYzJhZmQ4MTU5YjlmOTEyYWM4NThiMjZiZjZkNjQ3MGU3Mzg3OWZkOGVjZTgmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.FMSdUZ2JB-sKgtAwBAEugBGlMjzaxDVUiM9vWPo1UUg)\
_Image 3-20，Lead time for changes Report_

### 3.4.6 Change Failure Rate

![Image 3-21](https://private-user-images.githubusercontent.com/14356067/308937105-84f5ca7d-682b-4b2c-8264-822438320ff7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ5MjAsIm5iZiI6MTcwOTIxNDYyMCwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzcxMDUtODRmNWNhN2QtNjgyYi00YjJjLTgyNjQtODIyNDM4MzIwZmY3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNTAyMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWE2YTk5MGI3YjI4YmY4MzUzNjEwNmM1N2I2Yzg2OTc3MTg1OTVjNjYyZmE2NTQ4ZGM1NDgxZDFmM2I5YzYzYzcmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.teODSmzwd-NE2NjGK6dYlZgmT3LKreGpU_QmqfPpOBQ)\
_Image 3-21，Change Failure Rate Report_

### 3.4.7 Mean time to recovery

![Image 3-22](https://private-user-images.githubusercontent.com/14356067/308937208-7fb0f37a-3db0-4705-8e72-f4a915b895c7.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDkyMTQ5NzgsIm5iZiI6MTcwOTIxNDY3OCwicGF0aCI6Ii8xNDM1NjA2Ny8zMDg5MzcyMDgtN2ZiMGYzN2EtM2RiMC00NzA1LThlNzItZjRhOTE1Yjg5NWM3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAyMjklMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMjI5VDEzNTExOFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTBkNTMwNWRhODU4OWQ4NDQxOGY1ZWY5Y2I5YzFkMGExOWIyNjJiMjAzMzBkMzZjZTMzYmQ0MGZhZjEzYzIwMzUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.dkH6oZbOkThkw-8SYDK7ZOOCLFlRhw2Ki6MWsL4r8bA)\
_Image 3-22，mean time to recovery 

## 3.5 Export original data

After generating the report, you can export the original data for your board and pipeline (Image 3-15). Users can click the “Export board data” or “Export pipeline data” button to export the original data.

### 3.5.1 Export board data

It will export a csv file for board data

#### 3.5.1.1 Done card exporting 
Export the all done tickets during the time period(Image 1)

#### 3.5.1.1 Undone card exporting 
Export the latest updated 50 non-done tickets in your current active board. And it will order by heartbeat state and then last status change date(Image 3-16)

![Image 3-22](https://user-images.githubusercontent.com/995849/89784291-01f3b380-db4b-11ea-8f5a-d475e80014fb.png)\
_Image 3-22，Exported Board Data_

**All columns for Jira board:**
|Column name |Description|
|---|---|
|Issue key|Ticket ID|
|Summary|--|
|Issue Type|-- |
|Status|--|
|Story Point|--|
|Assignee|--|
|Reporter|--|
|Project Key|--|
|Project Name|--|
|Priority|--|
|Parent Summary|The epic for ticket|
|Sprint|Which sprint this ticket in |
|Labels|--|
|Cycle Time|total Cycle Time|
|Cycle Time / Story Points|Cycle Time for each point|
|Analysis Days|Analysis days for each ticket|
|In Dev Days|Development days for each ticket |
|Waiting Days|After development, how long will take before testing|
|Testing Days|Testing days for each ticket |
|Block Days|Blocked days for each ticket|
|Review Days|--|
|Original Cycle Time: {Column Name}|The data for Jira board original data |

### 3.5.2 Export pipeline data

It will export a csv file for pipeline data (image 3-17).

![Image 3-23](https://user-images.githubusercontent.com/995849/89784293-0324e080-db4b-11ea-975d-6609024aac49.png)\
_Image 3-23，Exported Pipeline Data_

**All columns for pipeline data:**
|Column name |Description|
|---|---|
|Pipeline Name|--|
|Pipeline Step|Step name |
|Committer|--|
|Code Committed Time|Committed time |
|PR Created Time|-- |
|PR Merged Time|-- |
|Deployment Completed Time|When it finished deploy |
|Total Lead Time (mins)|--|
|PR lead time (mins)|--|
|Pipeline lead time (mins)|--|
|Status|Status for pipeline (Pass or Failed)|

## 3.6 Caching data
   In HeartBeat tool design, we have a cache setting for verify jira & pipeLine & gitHub config function and pipleLine loading function and generate report function. 
   - `For Jira/Buildkite/Github data`: TTL for cache -> 90 seconds 
   - `For holiday data`:TTL for cache -> 5 minutes

# 4 Known issues

## 4.1 Change status name in Jira board setting when there are cards in this status
As an administrator of the jira board, if you modify the workflow to change the status name, it will affect the calculation of duration for cards in that status. Considering the potential loss of duration, changing the status name can lead to loss of precision in cycle time calculation for related cards.


# 5 Instructions

## 5.1 Prepare for Jira Project

For Classic Jira users, before you use this tool, you need to do some settings for the jira board. Otherwise, you cannot get the data. Here are the steps you need to do:

1.  Open https://{site}.atlassian.net/secure/admin/ViewIssueFields.jspa?start=0&searchFilter=
    ![Image 5-1](https://user-images.githubusercontent.com/995849/89785230-a75b5700-db4c-11ea-9ce2-4ff7894bbf25.png)\
    _Image 5-1_

2.  You need to enable any items you want to know. In the above page, If you want to change any items' screens, you can click the screens link in the actions column for that item. Then in the next page, check the project you want to change, and update it. Like: Story points

- ![Image 5-2](https://user-images.githubusercontent.com/995849/89785239-ab877480-db4c-11ea-9e82-952777936cf8.png)\
  _Image 5-2_

- ![Image 5-3](https://user-images.githubusercontent.com/995849/89785244-acb8a180-db4c-11ea-958f-663a7efa105c.png)\
  _Image 5-3_

For the next-gen Jira, when you add story points item, the name should be Story Points or Story point estimate.

## 5.2 Prepare env to use Heartbeat tool

For now, we just can download the code in our local machine, please follow below steps:

1.  Clone the backend code in your local machine: https://github.com/thoughtworks/HeartBeat/
2.  Follow the steps as below

# 6 Run Heartbeat

## 6.1 How to run frontend

```
cd HearBeat/frontend
pnpm install
pnpm start
```

## 6.1.1 How to build and local preview

```
pnpm build
pnpm preview
```

## 6.1.2 How to run unit tests

```
pnpm test
```

## 6.1.3 How to generate a test report

```
pnpm coverage
```

## 6.1.4 How to run e2e tests locally
1. Start the mock server
```
cd HearBeat/stubs
docker-compose up -d
```
2. Start the backend service
```
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=local --MOCK_SERVER_URL=http://localhost:4323'
```
3. Start the frontend service
```
cd HearBeat/frontend
pnpm start
```
4. Run the e2e tests
```
cd HearBeat/frontend
pnpm e2e
```

# 7 How to trigger BuildKite Pipeline
1. Add `[stub]` tag to the title of a commit message or PR to trigger stub-related deployments.

2. Add `[infra]` tag to the title of the commit message or PR to trigger infra-related deployments.

3. Add `[backend]` tag to the title of the commit message or PR to trigger backend-related deployments.

4. Add `[frontend]` tag to the title of the commit message or PR to trigger frontend-related deployments.

5. Add `[docs]` tag to the title of the commit message or PR to trigger docs-related deployments.


## Release

Release version follows  **[Software release life cycle](https://en.wikipedia.org/wiki/Software_release_life_cycle)**

### Release command in main branch

```sh
git tag {tag name}
git push origin {tag name}

# Delete tag
git tag -d {tag name}
git push origin :refs/tags/{tag name}
```

# 7 How to use

## 7.1 Docker-compose

First, create a `docker-compose.yml` file, and copy below code into the file.

```yaml
version: "3.4"

services:
  backend:
    image: ghcr.io/au-heartbeat/heartbeat_backend:latest
    container_name: backend
    ports:
      - 4322:4322
    restart: always
  frontend:
    image: ghcr.io/au-heartbeat/heartbeat_frontend:latest
    container_name: frontend
    ports:
      - 4321:80
    depends_on:
      - backend
    restart: always
```

Then, execute this command

```sh
docker-compose up -d frontend
```

### 7.1.1 Customize story point field in Jira
Specifically, story point field can be indicated in `docker-compose.yml`. You can do it as below.
```yaml
version: "3.4"
services:
  backend:
    image: ghcr.io/au-heartbeat/heartbeat_backend:latest
    container_name: backend
    ports:
      - 4322:4322
    restart: always
    environment:
      STORY_POINT_KEY: customfield_10061
  frontend:
    image: ghcr.io/au-heartbeat/heartbeat_frontend:latest
    container_name: frontend
    ports:
      - 4321:80
    depends_on:
      - backend
    restart: always
```

### 7.1.2 Multiple instance deployment
Specifically, if you want to run with multiple instances. You can do it with below docker compose file.

You can change `deploy.replicas` to adjust the number of instances.
```yaml
version: "3.4"

services:
  backend:
    image: ghcr.io/au-heartbeat/heartbeat_backend:latest
    expose:
      - 4322
    deploy:
      replicas: 3
    restart: always
    volumes:
      - file_volume:/app/output
  frontend:
    image: ghcr.io/au-heartbeat/heartbeat_frontend:latest
    container_name: frontend
    ports:
      - 4321:80
    depends_on:
      - backend
    restart: always
volumes:
  file_volume:
```

## 7.2 K8S

First, create a `k8s-heartbeat.yml` file, and copy below code into the file.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: ghcr.io/au-heartbeat/heartbeat_backend:latest
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 4322
      targetPort: 4322
  type: LoadBalancer
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: ghcr.io/au-heartbeat/heartbeat_frontend:latest
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 4321
      targetPort: 80
  type: LoadBalancer
```

Then, execute this command

```sh
kubectl apply -f k8s-heartbeat.yml
```

### 7.2.1 Multiple instance deployment
You also can deploy Heartbeats in multiple instances using K8S through the following [documentation](https://au-heartbeat.github.io/Heartbeat/en/devops/how-to-deploy-heartbeat-in-multiple-instances-by-k8s/).
