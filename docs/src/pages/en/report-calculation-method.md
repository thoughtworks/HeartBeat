---
title: Report Calculation Method
description: Report calculation method
layout: ../../layouts/MainLayout.astro
---

> Note: All metrics are calculated in the selected time range.

## Velocity

### Config

- StartDate、EndDate
- metrics select velocity
- JiraBoard token
- Crews member
- Real done label

### Calculate logic

- Get all done cards information based on token、date、member name.

### Definition

| Metrics                  | Calculate method                          | Note |
| :----------------------- | :---------------------------------------- | :--- |
| Velocity for Story Point | Sum of the story points of all done cards |      |
| Velocity for cards       | Sum of all done cards number              |      |

## Cycle Time

### Config

- StartDate、EndDate
- metrics select cycle time
- JiraBoard token
- Crews member
- Corresponding Columns name setting
- Real done label

### Calculate logic

- Get all done cards cycle time based on token、date、member name.
- Calculate Average Cycle Time : sum of cycle time for each selected column and then divided by the number of days and
  cards.
- Calculate Average column Cycle Time : the cycle time for each column divided by the number of days and cards.
- Calculate proportion of column Cycle Time in total Cycle Time : the cycle time for each column divided by sum of cycle
  time for each selected column.

### Definition

| Metrics                                                             | Calculate method                                                                        | Note |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- | :--- |
| Average Cycle Time                                                  | cycle time of all done cards per story point of day and per card of day                 |      |
| Average column Cycle Time                                           | cycle time of all done cards for each column per story point of day and per card of day |      |
| Proportion of column Cycle Time in total Cycle Time for each column | the cycle time for each column divided by total cycle time                              |      |

## Classification

### Config

- StartDate、EndDate
- Board type, Board I'd, Email, Project key, Site, Token
- Crews setting
- Real done
- Target Fields(Classification setting in metrics page)

### Calculate logic

- Get all cardCollection information (cardsNumber, fields in baseInfo), targetFields.
- Filter targetFields which flag is true (which were selected in Metrics page)
  1. get object value in fields of card baseInfo.
  2. get specific classification from object value.
  3. count the times specific classification shows.
  4. calculate proportion about different specific classifications to each targetField.
  5. output the fieldName, specific classification, proportion.

### Definition

| Metrics    | Description                                                   | Note |
| :--------- | :------------------------------------------------------------ | :--- |
| Field name | TargetFields selected in Metrics Page                         |      |
| Subtitle   | Specific classification for each targetField                  |      |
| Value      | The proportion of specific classification to Each targetField |      |

## Deployment Frequency

### Config

- StartDate、EndDate
- metrics select deployment frequency
- BuildKite token
- Organization (id)
- Pipeline name
- Step

### Calculate logic

- Get all deployment information based on token、date、organization and pipeline name.
- For each selected step
  1. Count DeployTimes. (DeployTimes includes name、step、passed deployInfos and failed deployInfos)
  2. Filter out passed deployInfos by time.
  3. Calculate Deployment Frequency: number of passed deployInfos divided by the number of days within the time
     period.
- Calculate Average Deployment Frequency: sum of deployment frequency for each selected step divided by the total number
  of selected step.

### Definition

| Metrics              | Description                                                   | Note |
| :------------------- | :------------------------------------------------------------ | :--- |
| Deployment frequency | Average number of passed deployments per day for each step    |      |
| Average              | The average of the deployment frequency of all selected steps |      |

## Meantime To Recovery

### Config

- StartDate、EndDate
- Metrics select meantime to recovery
- BuildKite token
- Organization (id)
- Pipeline name
- Step

### Calculate logic

- Get all deployment information according to token、date、organization and pipeline name.
- For each selected step
  1. Count DeployTimes. (DeployTimes includes name、step、passed deployInfos and failed deployInfos)
  2. Calculate total recovery time and recovery times:
     - `recovery time = pipeline create time of passed deployment - pipeline create time of first failed deployment since last passed`
     - `total recovery time is sum of recovery time`
     - `recovery times is number of deployment failed to passed`
  3. Calculate Mean Time To Recovery: total recovery time divided by the recovery times.
- Calculate Average Mean Time To Recovery: sum of mean time to recovery for each selected step divided by the total
  number of selected step.

### Definition

| Metrics               | Description                                                       | Note |
| :-------------------- | :---------------------------------------------------------------- | :--- |
| Mean Time To Recovery | Average time required to recover from deployment failed to passed |      |
| Average               | The average of the mean time to recovery of all selected steps    |      |

## Change Failure Rate

### Config

- StartDate、EndDate
- Metrics select change failure rate
- PipelineType PipelineToken
- Organization (id)
- Pipeline name
- Step

### Calculate logic

- Get all deployment information according to token、date、organization and pipeline name.
- For each selected step
  1. Count DeployTimes. (DeployTimes includes name、step、passed deployInfos and failed deployInfos)
  2. Calculate totalTimesOfPipeline, failedTimesOfPipeline, totalFailedTimes, totalTimes:
     - `failedTimesOfPipeline = number of failed deployInfos`
     - `passedTimesOfPipeline = number of passed deployInfos`
     - `totalTimesOfPipeline = failedTimesOfPipeline + passedTimesOfPipeline`
     - `totalFailedTimes += failedTimesOfPipeline`
     - `totalTimes += totalTimesOfPipeline`
  3. Calculate Change Failure Rate: `failureRate = failedTimesOfPipeline / totalTimesOfPipeline`
- Calculate Average Change Failure Rate: `AverageFailureRate = totalFailedTimes/totalTimes`

### Definition

| Metrics     | Description                            | Note |
| :---------- | :------------------------------------- | :--- |
| failureRate | The frequency of each pipeline failure |      |
| Average     | The average of failureRate             |      |

## Lead Time for changes

### Config

- StartDate、EndDate
- Metrics select lead time for changes
- Pipeline Type, Pipeline Token
- SourceControl Type, SourceControl Token
- Pipeline organization, name, Step

### Calculate logic

- Get deployment information according to pipeline config.
- Get pull request information according to the repository in deployment information.
- Get commit information according to the repository in deployment information.
- For each selected step:

  1. Get DeployTimes. (DeployTimes includes name、step、passed deployInfos and failed deployInfos).
  2. Filter the passed deployInfos.
  3. Get pull request info according to the repository in passed deployInfos.
  4. Get commit info according to the commitId in pull request info.
  5. Now we get some deploy and commit times:
     - `jobFinishTime = job finishTime of the job`
     - `prMergedTime = time of the pull request be merged`
     - `firstCommitTimeInPr = the first time of the commit in this pull request`
     - `firstCommitTime = the first time of the commit without pr`
  6. Calculate Lead Time for changes:

     (1).None PR：

     - `prLeadTime = 0`
     - `pipelineLeadTime = jobFinishTime - firstCommitTime`
     - `totalDelayTime = prLeadTime + pipelineLeadTime`

     (2).PR：

     - `prLeadTime = prMergedTime - firstCommitTimeInPr`
     - `prLeadTime = prMergedTime - prCreateTime`(if no first commit time)
     - `pipelineLeadTime = jobFinishTime - prMergedTime`
     - `totalDelayTime = prLeadTime + pipelineLeadTime`

- Calculate Average Lead Time for changes:
  - `AverageLeadMergeDelayTime = totalPrLeadTime / pipelineCount `
  - `AveragePipelineDelayTime = totalPipelineLeadTime/pipelineCount`
  - `AverageTotalDelayTime = AveragePrLeadTime + AveragePipelineLeadTime`

### Definition

| Metrics               | Description                                            | Note |
| :-------------------- | :----------------------------------------------------- | :--- |
| Lead Time for changes | The time from code commit to deploy production success |      |
| Average               | The average of lead Time for per pipeline              |      |
