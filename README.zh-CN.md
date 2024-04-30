# Heartbeat （2023/07）

[![Build status](https://badge.buildkite.com/62f2d9def796f9bf8d79dc67e548341b6e3e3ad07631164b07.svg)](https://buildkite.com/heartbeat-backup/heartbeat)[![Codacy Badge](https://app.codacy.com/project/badge/Grade/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Grade)[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/2e19839055d3429598b2141884496c49)](https://www.codacy.com/gh/au-heartbeat/HeartBeat/dashboard?utm_source=github.com&utm_medium=referral&utm_content=au-heartbeat/HeartBeat&utm_campaign=Badge_Coverage)

[![Docs](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Docs.yaml) [![Frontend](https://github.com/au-heartbeat/HeartBeat/actions/workflows/frontend.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/frontend.yml) [![Backend](https://github.com/au-heartbeat/HeartBeat/actions/workflows/backend.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/backend.yml) [![Security](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Security.yml/badge.svg)](https://github.com/au-heartbeat/HeartBeat/actions/workflows/Security.yml) [![Build and Deploy](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/au-heartbeat/Heartbeat/actions/workflows/build-and-deploy.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# 1 什么是 HeartBeat

HeartBeat 是了解项目交付情况的工具，可帮助团队确定绩效指标，从而推动持续改进并提高团队生产力和效率。

在 2019 年发布的《DevOps 现状报告》中，Google Cloud 和 4 Key metrics 的研究团队分享了用于度量 DevOps 绩效、开发和交付实践有效性的关键指标。经过 6 年的探索，研究者们最终确定了 4 个度量指标，用以提供软件交付和效能方面的系统性高层视图。

**这四个关键指标有：**

1.  部署频率 (DF)
2.  平均变更时间 (LTC)
3.  平均恢复时间 (MTTR)
4.  变更失败率 (CFR)

HeartBeat 工具除了可以用来统计部署频率、平均变更时间以及变更失败率外，我们还可以统计了其他数据，例如：速率(Velocity)、周期时间(Cycle Time)和工作分类(Classification)。

需要特别说明的是，关于平均恢复时间 (MTTR)指标，如果在选定时间范围内，pipeline 还处于失败状态，则计算 MTTR 的时候不会包括未修复的这部分数据。

# 2 支持的工具

在 2020 年 6 月发布的第一版中，我们支持 Jira/Buildkite/Github 生成相应的指标数据。
| 种类 | 看板 | 部署工具 | 代码库 |
| ------------- | --------------------- | ---------------------------------------- | -------------------------- |
| 支持的工具 | Jira √ </br> Trello × | Buildkite √ </br>Teamcity × </br> GoCD × | Github √ </br> Bitbucket × |

**注意：** “√” 意味着支持，“×” 意味着暂不支持

# 3 产品特性

## 3.1 配置项目信息

### 3.1.1 配置主页

在生成度量数据之前，用户需要在主页（Image3-1）中配置项目信息，您可以为项目创建一个新项目，也可以导入以前保存的配置 json 文件。配置文件导入功能将在”导入和导出功能”中介绍。

![Image 3-1](https://user-images.githubusercontent.com/995849/90855493-5b14e000-e3b2-11ea-9222-eba90c37e05e.png)\
_Image 3-1，home page_

#### 3.1.2 配置搜索数据

如果您是第一次使用本产品，您需要选择“创建新项目”，它将转到配置页面(Image 3-2)

![Image 3-2](https://user-images.githubusercontent.com/995849/90855655-bc3cb380-e3b2-11ea-8bed-28750ee26aae.png)\
_Image 3-2，Project config page_

用户需要选择统计时间段，随后的所有数据都将基于该时间段。

**两种不同的时间段：**

1.  **常规日历 / Regular Calendar(Weekend Considered)：** 如果选择此项，则意味着所有数据都将排除周末。
2.  **中国假期的日历 / Calendar with Chinese Holiday:** 如果选择此项目，则意味着所有数据将排除周末和中国假期。 因此，如果您选择的时间段包含中国假期，则可以选择此项目。

下图展示了所有可以获取的数据，目前，我们支持六种指标数据(Image 3-3).

![Image 3-3](https://user-images.githubusercontent.com/995849/90855755-ef7f4280-e3b2-11ea-8b72-923f544db508.png)\
_Image 3-3，Metrics Data_

#### 3.1.3 配置 看板/部署工具/代码库

因为所有指标数据来自项目使用的不同工具。因此我们需要访问这些工具，然后您才能获取统计数据。因此，在选择时间段和指标数据之后，您需要输入不同工具的配置信息(Image 3-4).

![Image 3-4](https://user-images.githubusercontent.com/995849/90856214-0d00dc00-e3b4-11ea-9f51-7fc0bd6a5ab8.png)\
Image 3-4，Project config

**看板配置细节：**
|Items|Description|
|---|---|
|Board Type|支持两种看板类型: Classic Jira 和 Next-gen Jira|
|Board Id|BoardId 的值为一个数字。您需要从您团队的 Jira URL 中找到它。<br/>例如： <br/> 1. 你的 Jira board 的 URL 如下所示，那么数字 2 就是你的 boardId <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 <br/> 2. 你的 Jira board 的 URL 包含 rapidView=3，那么 3 就是你的 boardId <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Project|Project 是您的 Jira project 关键字。您也可以在您的 Jira URL 中找到它。 <br/> 例如： <br/> 1. 你的 Jira board 的 URL 如下所示，那么 ADM 就是 project 的值 <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2<br/> 2. 你的 Jira board 的 URL 包含 projectKey=KAN1，那么 KAN1 就是 project 的值 <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Site|Site 是您的 Jira 项目的域，在下面的 URL 中 dorametrics 就是 site 的值 <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 |
|Email|可以登录您的 Jira 项目的邮件地址 |
|Token|上述邮件地址的 token https://id.atlassian.com/manage-profile/security/api-tokens |

**部署工具配置细节：**
|Items|Description|
|---|---|
|PipelineTool|您所在团队的部署流水线工具，在第一版中仅支持 BuildKit|
|Token|流水线工具的 Token https://buildkite.com/user/api-access-tokens |

**源码管理工具配置细节：**
|Items|Description|
|---|---|
|SourceControl|您所在团队的源码管理工具，在第一版中仅支持 GitHub|
|Token|源码管理工具的 Token https://github.com/settings/tokens |

### 3.2 配置指标数据

键入详细信息后，用户需要单击“验证”按钮以验证是否可以访问这些工具。一经验证通过，可以单击“下一步”按钮转到下一页-Config Metrics 页面(Image 3-5，Image 3-6，Image 3-7)

#### 3.2.1 配置团队成员和周期时间

![Image 3-5](https://user-images.githubusercontent.com/995849/90856562-c6f84800-e3b4-11ea-80ea-f1a267f1dcd7.png)\
_Image 3-5, Crews/Cycle Time config_

**团队成员设置 / Crew Settings:** 在上一页中，HeartBeat 取到了您选择的时间段内所有已完成的 Jira Ticket。与此同时，HeartBeat 也获取到了这些 Jira Ticket 的 Assignee 列表。在团队成员（Crew Settings）设置中，将会列出所有 Assignee。用户可以选择基于任何 Assignee 或所有 Assignee 来生成报告。
**周期时间 / Cycle Time:** Cycle Time 将列出当前活动的 Jira 看板的所有列。用户需要将每个列映射到 HeartBeat 支持列。 例如，您的 Jira 看板中有“进行中”列，表示开发人员正在此 Ticket 上工作，因此对于我们提供的列表，它应与“In Dev”对应。

| Status              | Description                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| To do               | 属于本列的 Ticket 需要被开发者拣选和完成。同时 Cycle time 并不会统计在本列所花费的时间。                           |
| Analysis            | Ticket 仍然需要 BA 或者其他人来进行分析。Cycle time 并不会统计在本列所花费的时间。                                 |
| In Dev              | 这意味着开发人员正在 Ticket 上工作。该时间应该是 Cycle Time 的一部分，被称为开发时间。                             |
| Block               | 这意味着由于某些问题导致 Ticket 无法正常进行。该时间应该是 Cycle Time 的一部分，被称为受阻碍时间。                 |
| Waiting for testing | 这意味着 Ticket 处于等待开发选择质量检查人员进行质量检查的阶段。该时间应该是 Cycle Time 的一部分，被称为等待时间。 |
| Testing             | 这意味着质量检查人员正在测试 Ticket。该时间应该是 Cycle Time 的一部分，被称为测试时间。                            |
| Review              | 这表示 PO 或其他人正在审查 Ticket。该时间应该是 Cycle Time 的一部分，被称为审查时间。                              |
| Done                | 这意味着 Ticket 已经完成。Cycle Time 不包括这个时间。                                                              |
| --                  | 如果您不需要进行映射，请选择本项                                                                                   |

#### 3.2.2 设置工作分类

![Image 3-6](https://user-images.githubusercontent.com/995849/89784259-f56f5b00-db4a-11ea-8a58-d6238e81df3c.png)\
_Image 3-6，Classification Settings_

在工作分类设置中，HeartBeat 会列出您的 Jira 看板上的所有 Context 字段，您可以根据需要来选择它们。

#### 3.2.3 部署频率(Deployment Frequency)和变更准备时间(Lead Time for Changes)

![Image 3-7](https://user-images.githubusercontent.com/995849/89784260-f6a08800-db4a-11ea-8ce2-87983363aa18.png)\
_Image 3-7，Settings for Pipeline_

| Items         | Description  |
| ------------- |--------------|
| Organization  | 你的部署流水线所属的组织 |
| Pipeline Name | 你的流水线名       |
| Steps         | 流水线步骤名       |
| Crew setting  | 代码提交者        |

## 3.2 导入导出配置信息

### 3.2.1 导出 Json 配置文件

用户首次使用此工具时，需要创建一个项目，并进行一些配置。为了避免用户每次重复输入配置信息，我们在 config 和指标 Metrics 页面中提供了一个“保存”按钮。在配置页面中，单击保存按钮，它将配置页面中的所有项目保存在一个 Json 文件中。如果单击“HeartBeat”页面中的“保存”按钮，它将把 config 和指标度量标准中的所有项目都保存在 Json 文件中。 示例 json 文件请见(Image 3-8)。注意：下图中仅包含了文件的部分内容。

![Image 3-8](https://user-images.githubusercontent.com/995849/89784710-b4c41180-db4b-11ea-9bc4-db14ce98ef69.png)\
_Image 3-8, Config Json file_

### 3.2.2 导入 Json 配置文件

如果用户之前已经保存过配置文件，则无需创建新项目。在主页中，可以单击“从文件导入项目”按钮(Image 3-1)以选择配置文件。

如果您的配置文件太旧，并且该工具已经具有一些新功能更改，那么当您导入配置文件时将会看到一些警告信息(Image 3-9)。这时，您需要重新选择一些数据以继续使用本工具。

![Image 3-9](https://user-images.githubusercontent.com/995849/89784267-f902e200-db4a-11ea-9d0b-a8ab29a8819e.png)\
_Image 3-9, Warning message_

## 3.3 生成 Metrics 数据

当您完成了所有设置项，HeartBeat 可以开始为您生成报告了。

### 3.3.1 交付速率 / Velocity

在 Velocity 报告中，HeartBeat 将按 Story Point 和 Story 的数量列出相应的数据。(image 3-10)
![Image 3-10](https://user-images.githubusercontent.com/995849/90856819-5ef63180-e3b5-11ea-8e94-e5363d305cf1.png)\
_Image 3-10，Velocity Report_

### 3.3.2 周期时间 / Cycle Time

计算过程数据和 Cycle Time 的最终结果通过四舍五入方法计算，小数点后保留两位数字。例如：3.567 保留到 3.56。

![Image 3-11](https://user-images.githubusercontent.com/995849/89784273-fbfdd280-db4a-11ea-9185-da89a862dace.png)\
_Image 3-11，Cycle Time Report_

### 3.3.3 工作分类 / Classification

![Image 3-12](https://user-images.githubusercontent.com/995849/89784278-fdc79600-db4a-11ea-820a-fc409a89b86a.png)\
_Image 3-12，Classification Report_

### 3.3.4 部署频率 / Deployment Frequency

![Image 3-13](https://user-images.githubusercontent.com/995849/89784281-fef8c300-db4a-11ea-992b-6e2eca426f53.png)\
_Image 3-13，Deployment Frequency Report_

### 3.3.5 变更等待时间 / Lead time for changes Data

![Image 3-14](https://user-images.githubusercontent.com/995849/89784283-ff915980-db4a-11ea-83b3-304372e8749a.png)\
_Image 3-14，Lead time for changes Report_

### 3.3.6 变更失败率 / Change Failure Rate

![Image 3-15](https://user-images.githubusercontent.com/995849/89784288-00c28680-db4b-11ea-9756-878176148d63.png)\
_Image 3-15，Change Failure Rate Report_

## 3.4 导出报告

生成报告后，您可以导出 Jira 看板和部署流水线的原始数据(Image 3-15)。用户可以单击“Export board data”或“Export pipeline data”按钮以导出原始数据。

### 3.4.1 导出看板数据 / Export board data

本功能会导出看板数据到 csv 文件

#### 3.4.1.1 导出已完成 card

在所选择时间段内导出所有已完成的 card

#### 3.4.1.2 导出未完成 card

在所选时间段内拉取最新修改的 50 张 cards，导出时先根据 heartBeat 的状态排序，然后再根据最近状态改变时间排序。(Image 3-16)

![Image 3-16](https://user-images.githubusercontent.com/995849/89784291-01f3b380-db4b-11ea-8f5a-d475e80014fb.png)\
_Image 3-16，Exported Board Data_

**Jira 看板的所有列：**
|列名 |描述|
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
|Parent Summary|Epic 描述|
|Sprint|Ticket 所在的 Sprint |
|Labels|--|
|Cycle Time|总 Cycle Time|
|Cycle Time / Story Points|每个 Story Point 的 Cycle Time|
|Analysis Days|每个 Ticket 所用的分析时间|
|In Dev Days|每个 Ticket 所用的开发时间|
|Waiting Days|从开发到测试所用的等待时间|
|Testing Days|每个 Ticket 所用的测试时间|
|Block Days|每个 Ticket 的被阻碍时间|
|Review Days|--|
|Original Cycle Time: {Column Name}|The data for Jira board original data |

### 3.4.2 导出 Pipeline 数据

本功能会导出部署流水线数据到 csv 文件(image 3-17).

![Image 3-17](https://user-images.githubusercontent.com/995849/89784293-0324e080-db4b-11ea-975d-6609024aac49.png)\
_Image 3-17，Exported Pipeline Data_

**部署流水线的所有列：**
|列名 |描述|
|---|---|
|Pipeline Name|--|
|Pipeline Step|步骤名 |
|Committer|--|
|Code Committed Time|代码提交次数 |
|PR Created Time|-- |
|PR Merged Time|-- |
|Deployment Completed Time|When it finished deploy |
|Total Lead Time (mins)|--|
|PR lead time (mins)|--|
|pipeline lead time (mins)|--|
|Status|部署结果(Pass 或者 Failed)|

# 4 已知的问题

## 4.1 更改 Jira 看板的列

In the current version, if you add or delete some columns for the jira board, it will change finish time for all last column tickets to add/delete column time. (It just impact Next-gen Jira), here are the details info:

| Jira Template | Add column                                                                                                                                | Delete column                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kanban        | It will change finish time for all last column tickets to add/delete column time                                                          | If delete non-last column: It will change finish time for all last column tickets to add/delete column time<br/>If delete the last column: It will change finish time for current last column tickets to add/delete column time |
| Scrum         | finish time for all last column tickets to add/delete column time<br/>All finished ticket’s finish time changed to add/delete column time | If delete the last column: It will change finish time for current last column tickets to add/delete column time                                                                                                                 |

For now, we don’t have a good solution to resolve this issue.

# 5 使用说明

## 5.1 设置 Jira Project

对于 Classic Jira 用户，在使用此工具之前，需要对 jira 看板进行一些设置，否则您将无法获取数据。以下是您需要执行的步骤：

1.  打开 https://{site}.atlassian.net/secure/admin/ViewIssueFields.jspa?start=0&searchFilter=

- ![Image 5-1](https://user-images.githubusercontent.com/995849/89785230-a75b5700-db4c-11ea-9ce2-4ff7894bbf25.png)\
  _Image 5-1_

2.  如果您需要启用任何项，可以在上述页面中单击该项目的“Action”列中的“Screens”链接。然后在下一页中，检查要更改的项目，然后进行更新。例如：故事点

- ![Image 5-2](https://user-images.githubusercontent.com/995849/89785239-ab877480-db4c-11ea-9e82-952777936cf8.png)\
  _Image 5-2_

- ![Image 5-3](https://user-images.githubusercontent.com/995849/89785244-acb8a180-db4c-11ea-958f-663a7efa105c.png)\
  _Image 5-3_

对于 next-gen Jira，当添加 Story Point 项时，名称应为“Story Points”或“Story point estimate”。

# 6 HeartBeat 基本操作

## 6.1 运行前端项目

```
cd HearBeat/frontend
pnpm install
pnpm start
```

## 6.1.1 打包 并进行本地预览

```
pnpm build
pnpm preview
```

## 6.1.2 前端单元测试

```
pnpm test
```

## 6.1.3 前端测试报告

```
pnpm coverage
```

## 6.1.4 端对端测试

```
pnpm e2e
```

## 6.1.5 端对端测试报告

```
pnpm e2e:report
```

# 7 How to trigger BuildKite Pipeline

1. commit message 或者 PR 的 title 中添加`[infra]` tag,以触发 infra 相关的部署。
2. commit message 或者 PR 的 title 中添加`[backend]` tag,以触发 backend 相关的部署。
3. commit message 或者 PR 的 title 中添加`[frontend]` tag,以触发 frontend 相关的部署。
4. commit message 或者 PR 的 title 中添加`[docs]` tag,以触发 docs 相关的部署。
