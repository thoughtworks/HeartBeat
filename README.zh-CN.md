# HeartBeat 用户手册（2020/06，第一版）

# 1 什么是HeartBeat

HeartBeat是ThoughtWorks的下一代产品。该产品可以方便、快速、准确地统计项目Dora Metrics数据。

在2019年发布的《DevOps现状报告》中，Google Cloud 和 Dora 的研究团队分享了用于度量DevOps绩效、开发和交付实践有效性的关键指标。经过6年的探索，研究者们最终确定了4个度量指标，用以提供软件交付和效能方面的系统性高层视图。

**这四个关键指标有：**

1. 部署频率 (DF)
2. 平均变更时间 (MLT)
3. 平均恢复时间 (MTTR)
4. 变更失败率 (CFR)

HeartBeat 工具除了可以用来统计部署频率、平均变更时间以及变更失败率外，我们还可以统计了其他数据，例如：速率(Velocity)、周期时间(Cycle Time)和工作分类(Classification)。

# 2 支持的工具

在2020年6月发布的第一版中，我们支持 Jira/Buildkite/Github 生成相应的Dora数据。
| 种类 | 看板 | 部署工具 | 代码库 |
| ------------- | --------------------- | ---------------------------------------- | -------------------------- |
| 支持的工具 | Jira √ </br> Trello × | Buildkite √ </br>Teamcity × </br> GoCD × | Github √ </br> Bitbucket × |

**注意：** “√” 意味着支持，“×” 意味着暂不支持

# 3 产品特性

## 3.1 配置项目信息

### 3.1.1 配置主页

在生成度量数据之前，用户需要在主页（Image3-1）中配置项目信息，您可以为项目创建一个新项目，也可以导入以前保存的配置json文件。配置文件导入功能将在”导入和导出功能”中介绍。

![Image 3-1](https://user-images.githubusercontent.com/995849/89783965-6b26f700-db4a-11ea-8b3a-a0d81ff37f85.png)
_Image 3-1，home page_

#### 3.1.2 配置搜索数据

如果您是第一次使用本产品，您需要选择“创建新项目”，它将转到配置页面(Image 3-2)

![Image 3-2](https://user-images.githubusercontent.com/995849/89784081-a3c6d080-db4a-11ea-8ede-f892968735ee.png)
_Image 3-2，Project config page_

用户需要选择统计时间段，随后的所有数据都将基于该时间段。

**两种不同的时间段：**

1. **常规日历 / Regular Calendar(Weekend Considered)：** 如果选择此项，则意味着所有数据都将排除周末。
2. **中国假期的日历 / Calendar with Chinese Holiday:** 如果选择此项目，则意味着所有数据将排除周末和中国假期。 因此，如果您选择的时间段包含中国假期，则可以选择此项目。

下图展示了所有可以获取的数据，目前，我们支持六种指标数据(Image 3-3).

![Image 3-3](https://user-images.githubusercontent.com/995849/89784245-ed172000-db4a-11ea-8188-2d00c90c55bf.png)
_Image 3-3，Metrics Data_

#### 3.1.3 配置 看板/部署工具/代码库

因为所有指标数据来自项目使用的不同工具。因此我们需要访问这些工具，然后您才能获取统计数据。因此，在选择时间段和指标数据之后，您需要输入不同工具的配置信息(Image 3-4).

![Image 3-4](https://user-images.githubusercontent.com/995849/89784256-f30d0100-db4a-11ea-903b-8ad5af40e6b3.png)
Image 3-4，Project config

**看板配置细节：**
|Items|Description|
|---|---|
|Board Type|支持两种看板类型: Classic Jira 和 Next-gen Jira|
|Board Id|BoardId的值为一个数字。您需要从您团队的Jira URL中找到它。<br/>例如： <br/> 1. 你的Jira board的URL如下所示，那么数字 2 就是你的boardId <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 <br/> 2. 你的Jira board的URL包含 rapidView=3，那么 3 就是你的boardId <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Project|Project是您的 Jira project 关键字。您也可以在您的Jira URL中找到它。 <br/> 例如： <br/> 1. 你的Jira board的URL如下所示，那么 ADM 就是project的值 <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2<br/> 2. 你的Jira board的URL包含 projectKey=KAN1，那么 KAN1 就是project的值 <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Site|Site 是您的Jira项目的域，在下面的URL中 dorametrics 就是site的值 <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 |
|Email|可以登录您的Jira项目的邮件地址 |
|Token|上述邮件地址的token |

**部署工具配置细节：**
|Items|Description|
|---|---|
|PipelineTool|您所在团队的部署流水线工具，在第一版中仅支持BuildKit|
|Token|流水线工具的Token|

**源码管理工具配置细节：**
|Items|Description|
|---|---|
|SourceControl|您所在团队的源码管理工具，在第一版中仅支持GitHub|
|Token|源码管理工具的Token|

### 3.2 Config Dora Metrics data

After inputting the details info, users need to click the “Verify” button to verify if can access to these tool. Once can access, can click the “Next” button go to next page -- Config Dora Metrics page(Image 3-5，Image 3-6，Image 3-7)

#### 3.2.1 Config Crews/Cycle Time

![Image 3-5](https://user-images.githubusercontent.com/995849/89784257-f43e2e00-db4a-11ea-80c8-f6a495822bfc.png)
_Image 3-5, Crews/Cycle Time config_

**Crew Settings:** In the last page, it will get all the tickets that finished in the time period selected in the last step. So also get the all assignees list that assigned for these done tickets. In the crew setting, will list all assignees. Users can select any assignees or all assignees to generate the report.  
**Cycle Time:** It will list all columns for the current active jira board. Then users need to map the each column to the Dora support columns. Like, if your board have “in progress” column, it means developer doing this ticket, so it should be mapping with “In Dev” for the list we provide.

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

![Image 3-6](https://user-images.githubusercontent.com/995849/89784259-f56f5b00-db4a-11ea-8a58-d6238e81df3c.png)
_Image 3-6，Classification Settings_

In classification settings, it will list all Context fields for your jira board. Users can select anyone to get the data for them.

#### 3.2.3 Deployment Frequency/Lead Time for Changes

![Image 3-7](https://user-images.githubusercontent.com/995849/89784260-f6a08800-db4a-11ea-8ce2-87983363aa18.png)
_Image 3-7，Settings for Pipeline_

| Items         | Description                         |
| ------------- | ----------------------------------- |
| Organization  | The organization for your pipelines |
| Pipeline Name | Your pipeline name                  |
| Steps         | Your pipeline steps name            |

## 3.2 Export and import config info

### 3.2.1 Export Config Json File

When user first use this tool, need to create a project, and do some config. To avoid the user entering configuration information repeatedly every time, we provide a “Save” button in the config and Dora Metrics pages. In config page, click the save button, it will save all items in config page in a Json file. If you click the save button in the Dora Metrics page, it will save all items in config and Dora metrics in a Json file. Here is the json file (Image 3-8)。Note: Below screenshot just contains a part of data.

![Image 3-8](https://user-images.githubusercontent.com/995849/89784710-b4c41180-db4b-11ea-9bc4-db14ce98ef69.png)
_Image 3-8, Config Json file_

### 3.2.2 Import Config Json File

When user already saved config file before, then you don’t need to create a new project. In the home page, can click Import Project from File button(Image 3-1) to select the config file. If your config file is too old, and the tool already have some new feature change, then if you import the config file, it will get some warning info(Image 3-9). You need to re-select some info, then go to the next page.

![Image 3-9](https://user-images.githubusercontent.com/995849/89784267-f902e200-db4a-11ea-9d0b-a8ab29a8819e.png)
_Image 3-9, Warning message_

## 3.3 Generate Dora Metrics Data

After config, then it will generate the report for you.

### 3.3.1 Velocity

In Velocity Report, it will list the corresponding data by Story Point and the number of story tickets. (image 3-10)
![Image 3-10](https://user-images.githubusercontent.com/995849/89784271-facca580-db4a-11ea-87be-a555bb05a0a3.png)
_Image 3-10，Velocity Report_

### 3.3.2 Cycle Time

The calculation process data and final result of Cycle Time are calculated by rounding method, and two digits are kept after the decimal point. Such as: 3.567... Is 3.56; 3.564... Is 3.56.

![Image 3-11](https://user-images.githubusercontent.com/995849/89784273-fbfdd280-db4a-11ea-9185-da89a862dace.png)
_Image 3-11，Cycle Time Report_

### 3.3.3 Classification

![Image 3-12](https://user-images.githubusercontent.com/995849/89784278-fdc79600-db4a-11ea-820a-fc409a89b86a.png)
_Image 3-12，Classification Report_

### 3.3.4 Deployment Frequency

![Image 3-13](https://user-images.githubusercontent.com/995849/89784281-fef8c300-db4a-11ea-992b-6e2eca426f53.png)
_Image 3-13，Deployment Frequency Report_

### 3.3.5 Lead time for changes Data

![Image 3-14](https://user-images.githubusercontent.com/995849/89784283-ff915980-db4a-11ea-83b3-304372e8749a.png)
_Image 3-14，Lead time for changes Report_

### 3.3.6 Change Failure Rate

![Image 3-15](https://user-images.githubusercontent.com/995849/89784288-00c28680-db4b-11ea-9756-878176148d63.png)
_Image 3-15，Change Failure Rate Report_

## 3.4 Export original data

After generating the report, you can export the original data for your board and pipeline (Image 3-15). Users can click the “Export board data” or “Export pipeline data” button to export the original data.

### 3.4.1 Export board data

It will export a scv file for board data. It contains two parts:
**Part 1:** Export the all done tickets during the time period
**Part 2:** Export the all non-done tickets in your current active board. And it will order by ticket status (Image 3-16)

![Image 3-16](https://user-images.githubusercontent.com/995849/89784291-01f3b380-db4b-11ea-8f5a-d475e80014fb.png)
_Image 3-16，Exported Board Data_

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

### 3.4.2 Export pipeline data

It will export a scv file for pipeline data (image 3-17).

![Image 3-17](https://user-images.githubusercontent.com/995849/89784293-0324e080-db4b-11ea-975d-6609024aac49.png)
_Image 3-17，Exported Pipeline Data_

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
|Time from PR Created to PR Merged (mins)|--|
|Time from PR Merged to Deployment Completed (mins)|--|
|Status|Status for pipeline (Pass or Failed)|

# 4 Known issues

## 4.1 Add/Delete columns in Jira board

In the current version, if you add or delete some columns for the jira board, it will change finish time for all last column tickets to add/delete column time. (It just impact Next-gen Jira), here are the details info:

| Jira Template | Add column                                                                                                                                | Delete column                                                                                                                                                                                                                   |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Kanban        | It will change finish time for all last column tickets to add/delete column time                                                          | If delete non-last column: It will change finish time for all last column tickets to add/delete column time<br/>If delete the last column: It will change finish time for current last column tickets to add/delete column time |
| Scrum         | finish time for all last column tickets to add/delete column time<br/>All finished ticket’s finish time changed to add/delete column time | If delete the last column: It will change finish time for current last column tickets to add/delete column time                                                                                                                 |

For now, we don’t have a good solution to resolve this issue.

# 5 Instructions

## 5.1 Prepare for Jira Project

For Classic Jira users, before you use this tool, you need to do some settings for the jira board. Otherwise, you cannot get the data. Here are the steps you need to do:

1. Open https://{site}.atlassian.net/secure/admin/ViewIssueFields.jspa?start=0&searchFilter=  
   ![Image 5-1](https://user-images.githubusercontent.com/995849/89785230-a75b5700-db4c-11ea-9ce2-4ff7894bbf25.png)

   _Image 5-1_

2. You need to enable any items you want to know. In the above page, If you want to change any items' screens, you can click the screens link in the actions column for that item. Then in the next page, check the project you want to change, and update it. Like: Story points
   ![Image 5-2](https://user-images.githubusercontent.com/995849/89785239-ab877480-db4c-11ea-9e82-952777936cf8.png)
   _Image 5-2_

   ![Image 5-3](https://user-images.githubusercontent.com/995849/89785244-acb8a180-db4c-11ea-958f-663a7efa105c.png)
   _Image 5-3_

For the next-gen Jira, when you add story points item, the name should be Story Points or Story point estimate.

## 5.2 Prepare env to use HeartBeat tool

For now, we just can download the code in our local machine, please follow below steps:

1. Clone the backend code in your local machine: https://github.com/Tw-Dora/HeartBeat/backend
2. Clone the frontend code in your local machine: https://github.com/Tw-Dora/HeartBeat/frontend
3. Follow the Readme to deploy the product

# 6 Install HeartBeat Backend

## 6.1 How to install

Install node modules:

```shell script
    yarn install
```

Run project:

```shell script
    yarn start
```

swagger address: `http://localhost:3001/swagger-html`

## 6.2 How to build it:

```shell script
    yarn package
```

## 6.3 How to package it

you can build server to binary file, it will output 3 files:

- heartbeat-backend-linux
- heartbeat-backend-macos
- heartbeat-backend-win.exe

these files can run on different system, you do not need to install node environment
