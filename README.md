# Heartbeat Project

[![Build status](https://badge.buildkite.com/62f2d9def796f9bf8d79dc67e548341b6e3e3ad07631164b07.svg)](https://buildkite.com/heartbeat-backup/heartbeat)[![Codacy Badge](https://app.codacy.com/project/badge/Grade/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Grade)[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Coverage)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=au-heartbeat-heartbeat-frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=au-heartbeat-heartbeat-frontend)
[![Frontend Coverage](https://sonarcloud.io/api/project_badges/measure?project=au-heartbeat-heartbeat-frontend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=au-heartbeat-heartbeat-frontend)
[![Backend Coverage](https://sonarcloud.io/api/project_badges/measure?project=au-heartbeat-heartbeat-backend&metric=coverage)](https://sonarcloud.io/summary/new_code?id=au-heartbeat-heartbeat-backend)

[![Docs](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml) [![Build and Deploy](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B23211%2Fgithub.com%2Fau-heartbeat%2FHeartbeat.svg?type=large)](https://app.fossa.com/projects/custom%2B23211%2Fgithub.com%2Fau-heartbeat%2FHeartbeat?ref=badge_large)

- [Heartbeat Project](#heartbeat-project)
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
      - [3.2.3 Setting advanced Setting](#323-setting-advanced-setting)
      - [3.2.4 Pipeline configuration](#324-pipeline-configuration)
  - [3.3 Export and import config info](#33-export-and-import-config-info)
    - [3.3.1 Export Config Json File](#331-export-config-json-file)
    - [3.3.2 Import Config Json File](#332-import-config-json-file)
  - [3.4 Generate Metrics report](#34-generate-metrics-report)
    - [3.4.1 Velocity](#341-velocity)
    - [3.4.2 Cycle Time](#342-cycle-time)
    - [3.4.3 Classification](#343-classification)
    - [3.4.4 Deployment Frequency](#344-deployment-frequency)
    - [3.4.5 Lead time for changes Data](#345-lead-time-for-changes-data)
    - [3.4.6 Change Failure Rate](#346-change-failure-rate)
    - [3.4.7 Mean time to recovery](#347-mean-time-to-recovery)
  - [3.5 Export original data](#35-export-original-data)
    - [3.5.1 Export board data](#351-export-board-data)
      - [3.5.1.1 Done card exporting](#3511-done-card-exporting)
      - [3.5.1.1 Undone card exporting](#3511-undone-card-exporting)
    - [3.5.2 Export pipeline data](#352-export-pipeline-data)
  - [3.6 Caching data](#36-caching-data)
- [4 Known issues](#4-known-issues)
  - [4.1  Change status name in Jira board setting when there are cards in this status](#41--change-status-name-in-jira-board-setting-when-there-are-cards-in-this-status)
- [5 Instructions](#5-instructions)
  - [5.1 Prepare for Jira Project](#51-prepare-for-jira-project)
  - [5.2 Prepare env to use Heartbeat tool](#52-prepare-env-to-use-heartbeat-tool)
- [6 Run Heartbeat](#6-run-heartbeat)
  - [6.1 How to run frontend](#61-how-to-run-frontend)
  - [6.1.1 How to build and local preview](#611-how-to-build-and-local-preview)
  - [6.1.2 How to run unit tests](#612-how-to-run-unit-tests)
  - [6.1.3 How to generate a test report](#613-how-to-generate-a-test-report)
  - [6.1.4 How to run E2E tests locally](#614-how-to-run-e2e-tests-locally)
  - [6.2 How to run backend](#62-how-to-run-backend)
- [7 How to trigger BuildKite Pipeline](#7-how-to-trigger-buildkite-pipeline)
  - [Release](#release)
    - [Release command in main branch](#release-command-in-main-branch)
- [7 How to use](#7-how-to-use)
  - [7.1 Docker-compose](#71-docker-compose)
    - [7.1.1 Customize story point field in Jira](#711-customize-story-point-field-in-jira)
    - [7.1.2 Multiple instance deployment](#712-multiple-instance-deployment)
  - [7.2 K8S](#72-k8s)
    - [7.2.1 Multiple instance deployment](#721-multiple-instance-deployment)
- [8. Contribution](#8-contribution)

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

![Image 3-1](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/1.png)\
_Image 3-1，home page_

#### 3.1.2 Config search data

If you are first use the product, you need to select “Create A New Project”，it will go to config page (Image 3-2)

![Image 3-2](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/2.png)\
_Image 3-2，Project config page_

Users need to select a period of time, then all of the data that follows is based on that time period.

**Have two items of time period:**

1.  **Regular Calendar(Weekend Considered):** If you select this item, it means all data will exclude the weekend.
2.  **Calendar with Chinese Holiday:** If you select this item, it means all data will exclude the weekend and Chinese holiday. So if the time period you selected contains Chinese holiday, you need to select this item.

All need to select which data you want to get, for now, we support seven metrics data (Image 3-3). Those seven metrics are `Deployment Frequency (DF)`, `Lead Time for changes (LTC)`, `Mean Time To Recover (MTTR)`, `Change Failure Rate (CFR)`, and `Velocity`, `Cycle time`, `Classification`, where

- `Velocity` : includes how many story points and cards we have completed within selected time period.
- `Cycle time`: the time it take for each card start to do until move to done.
- `Classification`: provide different dimensions to view how much efforts team spent within selected time period.

![Image 3-3](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/3.png)\
_Image 3-3，Metrics Data_

#### 3.1.3 Config project account

Because all metrics data from different tools that your projects use. Need to have the access to these tools then you can get the data. So after select time period and metrics data, then you need to input the config for different tools(Image 3-4).

According to your selected required data, you need to input account settings for the respective data source. Below is the mapping between your selected data to data source.

| Required Data         | Datasource     |
| --------------------- | -------------- |
| Velocity              | Board          |
| Cycle time            | Board          |
| Classification        | Board          |
| Lead time for changes | Repo，Pipeline |
| Deployment frequency  | Pipeline       |
| Change failure rate   | Pipeline       |
| Mean time to recovery | Pipeline       |

![Image 3-4](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/4.png)\
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

![Image 3-5](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/5.png)\
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

![Image 3-6](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/6.png)\
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

![Image 3-13](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/7.png)\
_Image 3-13，Settings for Pipeline_

They are sharing the similar settings which you need to specify the pipeline step so that Heartbeat will know in which pipeline and step, team consider it as deploy to PROD. So that we could use it to calculate metrics.

| Items         | Description                                       |
| ------------- --|----------------------------------------------------------------- |
| Organization  | The organization for your pipelines               |
| Pipeline Name | Your pipeline name                                |
| Steps         | The pipeline step that consider as deploy to PROD || Branches      | Your selected branches                            |

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
![Image 3-16](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/8.png)

You could find the drill down from `show more >` link from dashboard.

### 3.4.1 Velocity

In Velocity Report, it will list the corresponding data by Story Point and the number of story tickets. (image 3-10)
![Image 3-16](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/9.png)\
_Image 3-16，Velocity Report_

### 3.4.2 Cycle Time

The calculation process data and final result of Cycle Time are calculated by rounding method, and two digits are kept after the decimal point. Such as: 3.567... Is 3.56; 3.564... Is 3.56.

![Image 3-17](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/10.png)\
_Image 3-17，Cycle Time Report_

### 3.4.3 Classification

It will show the classification data of Board based on your selection on `Classification Settings` in metrics page.

The percentage value represent the count of that type tickets vs total count of tickets.

![Image 3-18](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/11.png)\
_Image 3-18，Classification Report_

### 3.4.4 Deployment Frequency

![Image 3-19](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/12.png)\
_Image 3-19，Deployment Frequency Report_

### 3.4.5 Lead time for changes Data

![Image 3-20](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/13.png)\
_Image 3-20，Lead time for changes Report_

### 3.4.6 Change Failure Rate

![Image 3-21](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/14.png)\
_Image 3-21，Change Failure Rate Report_

### 3.4.7 Mean time to recovery

![Image 3-22](https://cdn.jsdelivr.net/gh/au-heartbeat/data-hosting@main/readme/15.png)\
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

## 4.1  Change status name in Jira board setting when there are cards in this status
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

## 6.1.4 How to run E2E tests locally

2. Start the backend service

```
cd HearBeat/backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

3. Start the frontend service

```
cd HearBeat/frontend
pnpm start
```

4. Run the E2E tests

```
cd HearBeat/frontend
pnpm run e2e:headed
```
## 6.2 How to run backend
Refer to [run backend](backend/README.md#1-how-to-start-backend-application)

# 7 How to trigger BuildKite Pipeline

1. Add `[infra]` tag to the title of the commit message or PR to trigger infra-related deployments.

2. Add `[backend]` tag to the title of the commit message or PR to trigger backend-related deployments.

3. Add `[frontend]` tag to the title of the commit message or PR to trigger frontend-related deployments.

4. Add `[docs]` tag to the title of the commit message or PR to trigger docs-related deployments.

## Release

Release version follows **[Software release life cycle](https://en.wikipedia.org/wiki/Software_release_life_cycle)**

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

# 8. Contribution

We love your input! Please see our [contributing guide](contribution.md) to get started. Thank you 🙏 to all our contributors!

