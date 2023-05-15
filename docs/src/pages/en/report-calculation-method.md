---
title: Report Calculation Method
description: Report calculation method
layout: ../../layouts/MainLayout.astro
---

> Note: All metrics are calculated in the selected time range.

## Velocity

| Metrics                 | Calculate method                         | Note |
| :---------------------- | :--------------------------------------- | :--- |
| Velocity for Storypoint | Sum of the storypoints of all done cards |      |
| Velocity for cards      | Sum of all done cards                    |      |

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
