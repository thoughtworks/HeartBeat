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
| PipeLine name / step | Average number of passed deployments per day for each step    |      |
| Average              | The average of the deployment frequency of all selected steps |      |
