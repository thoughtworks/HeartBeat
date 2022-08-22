# HeartBeat User Guide（2022/08，Version 2）

# 1 About HeartBeat

HeartBeat is a tool for tracking project delivery metrics that can help you get a better understanding of delivery performance. This product allows you easily get all aspects of source data faster and more accurate to analyze team delivery performance which enables delivery teams and team leaders focusing on driving continuous improvement and enhancing team productivity and efficiency.

State of DevOps Report is launching in 2019. In this webinar, The 4 key metrics research team and Google Cloud share key metrics to measure DevOps performance, measure the effectiveness of development and delivery practices. They searching about six years, developed four metrics that provide a high-level systems view of software delivery and performance.

**Here are the for Key meterics:**

1. Deployment Frequency (DF)
2. Lead Time for changes (LTC)
3. Mean Time To Recover (MTTR)
4. Change Failure Rate (CFR)

In HeartBeat tool, we also have some other metrics, like: Velocity, Cycle Time and Classification. So we can collect DF, LTC, CFR, Velocity, Cycle Time and Classification.

# 2 Support tools

Here is the user manaul for Version 1 on 2020/06. For now, we just can support Jira/Buildkite/Github to generate the corresponding metrics data.
| Type | board | pipeline | Repo |
| ------------- | --------------------- | ---------------------------------------- | -------------------------- |
| Support tools | Jira √ </br> Trello × | Buildkite √ </br>Teamcity × </br> GoCD × | Github √ </br> Bitbucket × |

**Note：** “√” means can support, “×” means can not support

# 3 Product Features

## 3.1 Config project info

### 3.1.1 Config Board/Pipeline/Source data

Before generator the metrics data, user need to config the project info, in Home page (Image3-1), you can create a new project for your project, or you can import a project config json file (If you already saved one config file, for import file feature will introduce in “Import and Export feature ”).

![Image 3-1](https://user-images.githubusercontent.com/995849/90855493-5b14e000-e3b2-11ea-9222-eba90c37e05e.png)\
_Image 3-1，home page_

#### 3.1.2 Config search data

If you are first use the product, you need to select “Create A New Project”，it will go to config page (Image 3-2)

![Image 3-2](https://user-images.githubusercontent.com/995849/90855655-bc3cb380-e3b2-11ea-8bed-28750ee26aae.png)\
_Image 3-2，Project config page_

Users need to select a period of time, then all of the data that follows is based on that time period.

**Have two items of time period:**

1. **Regular Calendar(Weekend Considered):** If you select this item, it means all data will exclude the weekend.
2. **Calendar with Chinese Holiday:** If you select this item, it means all data will exclude the weekend and Chinese holiday. So if the time period you selected contains Chinese holiday, you need to select this item.

All need to select which data you want to get, for now, we support six metrics data (Image 3-3).

![Image 3-3](https://user-images.githubusercontent.com/995849/90855755-ef7f4280-e3b2-11ea-8b72-923f544db508.png)\
_Image 3-3，Metrics Data_

#### 3.1.3 Config project account

Because all metrics data from different tools that your projects use. Need to have the access to these tools then you can get the data. So after select time period and metrics data, then you need to input the config for different tools(Image 3-4).

![Image 3-4](https://user-images.githubusercontent.com/995849/90856214-0d00dc00-e3b4-11ea-9f51-7fc0bd6a5ab8.png)\
Image 3-4，Project config

**The details for board:**
|Items|Description|
|---|---|
|Board Type|Support two types of board: Classic Jira and Next-gen Jira|
|Board Id|The value of BoardId is number. You need to find it from your team’s Jira board URL.<br/>For Example: <br/> 1. Your jira board URL like below, then 2 is the boardId <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 <br/> 2. Your jira board URL like below, then rapidView=3, 3 is the boardId <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Project|Project is the project key for your project. Also can find it from your team’s Jira board URL. <br/> For Example: <br/> 1. Your jira board URL like below, then ADM is the project <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2<br/> 2. Your jira board URL like below, then projectKey=KAN1, KAN1 is the project <br/> https://pokergame.atlassian.net/secure/RapidBoard.jspa?projectKey=KAN1&useStoredSettings=true&rapidView=3 |
|Site|Site is the domain for your jira board, like below URL, dorametrics is the site <br/> https://dorametrics.atlassian.net/jira/software/projects/ADM/boards/2 |
|Email|The email can access to the Jira board |
|Token|Use the token for the email you used, https://id.atlassian.com/manage-profile/security/api-tokens |

**The details for Pipeline:**
|Items|Description|
|---|---|
|PipelineTool| The pipeline tool you team use, but just support BuildKit in Version 1|
|Token|The token can access to pipeline tool, https://buildkite.com/user/api-access-tokens|

**The details for SourceControl:**
|Items|Description|
|---|---|
|SourceControl|The source control tool you team use, but just support GitHub in Version 1|
|Token|The token can access to source control tool, https://github.com/settings/tokens|

### 3.2 Config Metrics data

After inputting the details info, users need to click the “Verify” button to verify if can access to these tool. Once can access, can click the “Next” button go to next page -- Config Metrics page(Image 3-5，Image 3-6，Image 3-7)

#### 3.2.1 Config Crews/Cycle Time

![Image 3-5](https://user-images.githubusercontent.com/995849/90856562-c6f84800-e3b4-11ea-80ea-f1a267f1dcd7.png)\
_Image 3-5, Crews/Cycle Time config_

**Crew Settings:** In the last page, it will get all the tickets that finished in the time period selected in the last step. So also get the all assignees list that assigned for these done tickets. In the crew setting, will list all assignees. Users can select any assignees or all assignees to generate the report.  
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

![Image 3-6](https://user-images.githubusercontent.com/995849/89784259-f56f5b00-db4a-11ea-8a58-d6238e81df3c.png)\
_Image 3-6，Classification Settings_

In classification settings, it will list all Context fields for your jira board. Users can select anyone to get the data for them.

#### 3.2.3 Deployment Frequency/Lead Time for Changes

![Image 3-7](https://user-images.githubusercontent.com/995849/89784260-f6a08800-db4a-11ea-8ce2-87983363aa18.png)\
_Image 3-7，Settings for Pipeline_

| Items         | Description                         |
| ------------- | ----------------------------------- |
| Organization  | The organization for your pipelines |
| Pipeline Name | Your pipeline name                  |
| Steps         | Your pipeline steps name            |

## 3.2 Export and import config info

### 3.2.1 Export Config Json File

When user first use this tool, need to create a project, and do some config. To avoid the user entering configuration information repeatedly every time, we provide a “Save” button in the config and metrics pages. In config page, click the save button, it will save all items in config page in a Json file. If you click the save button in the metrics page, it will save all items in config and metrics settings in a Json file. Here is the json file (Image 3-8)。Note: Below screenshot just contains a part of data.

![Image 3-8](https://user-images.githubusercontent.com/995849/89784710-b4c41180-db4b-11ea-9bc4-db14ce98ef69.png)\
_Image 3-8, Config Json file_

### 3.2.2 Import Config Json File

When user already saved config file before, then you don’t need to create a new project. In the home page, can click Import Project from File button(Image 3-1) to select the config file. If your config file is too old, and the tool already have some new feature change, then if you import the config file, it will get some warning info(Image 3-9). You need to re-select some info, then go to the next page.

![Image 3-9](https://user-images.githubusercontent.com/995849/89784267-f902e200-db4a-11ea-9d0b-a8ab29a8819e.png)\
_Image 3-9, Warning message_

## 3.3 Generate Metrics Data

After config, then it will generate the report for you.

### 3.3.1 Velocity

In Velocity Report, it will list the corresponding data by Story Point and the number of story tickets. (image 3-10)
![Image 3-10](https://user-images.githubusercontent.com/995849/90856819-5ef63180-e3b5-11ea-8e94-e5363d305cf1.png)\
_Image 3-10，Velocity Report_

### 3.3.2 Cycle Time

The calculation process data and final result of Cycle Time are calculated by rounding method, and two digits are kept after the decimal point. Such as: 3.567... Is 3.56; 3.564... Is 3.56.

![Image 3-11](https://user-images.githubusercontent.com/995849/89784273-fbfdd280-db4a-11ea-9185-da89a862dace.png)\
_Image 3-11，Cycle Time Report_

### 3.3.3 Classification

![Image 3-12](https://user-images.githubusercontent.com/995849/89784278-fdc79600-db4a-11ea-820a-fc409a89b86a.png)\
_Image 3-12，Classification Report_

### 3.3.4 Deployment Frequency

![Image 3-13](https://user-images.githubusercontent.com/995849/89784281-fef8c300-db4a-11ea-992b-6e2eca426f53.png)\
_Image 3-13，Deployment Frequency Report_

### 3.3.5 Lead time for changes Data

![Image 3-14](https://user-images.githubusercontent.com/995849/89784283-ff915980-db4a-11ea-83b3-304372e8749a.png)\
_Image 3-14，Lead time for changes Report_

### 3.3.6 Change Failure Rate

![Image 3-15](https://user-images.githubusercontent.com/995849/89784288-00c28680-db4b-11ea-9756-878176148d63.png)\
_Image 3-15，Change Failure Rate Report_

### 3.3.7 Completed Cards by Sprint Graph

![Image 3-16](https://user-images.githubusercontent.com/109513161/185023348-d7320a75-aacb-472f-9483-46177723481a.png)\
_Image 3-16，Throughput - Completed Cards by Sprint_

### 3.3.8 Average cycle time Graph

![Image 3-17](https://user-images.githubusercontent.com/109513161/185023202-9c791105-d559-42de-9736-d44378c25651.png)\
_Image 3-17，Average Cycle Time - Day_

### 3.3.9 Time Allocation Graph

The graph shows percentage of blocked time and developing time for every sprint which selected by user.

![Image 3-18](https://user-images.githubusercontent.com/109513161/185022817-1d987b4a-dbaf-4514-96b1-e76e7e6770c6.png)\
_Image 3-18，Time Allocation_

### 3.3.10 Block Reason Graph

The graph shows block reason for the latest sprint which selected by user.

![Image 3-19](https://user-images.githubusercontent.com/109513161/185023327-e04311d6-5000-4c8f-b460-044799ce2fea.png)\
_Image 3-19，Block Reason - Latest Iteration_

## 3.4 Export original data

After generating the report, you can export the original data for your board and pipeline (Image 3-15). Users can click the “Export board data” or “Export pipeline data” button to export the original data.

### 3.4.1 Export board data

It will export a csv file for board data. It contains two parts:
**Part 1:** Export the all done tickets during the time period
**Part 2:** Export the all non-done tickets in your current active board. And it will order by ticket status (Image 3-20)

![Image 3-20](https://user-images.githubusercontent.com/995849/89784291-01f3b380-db4b-11ea-8f5a-d475e80014fb.png)\
_Image 3-20，Exported Board Data_

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

It will export a csv file for pipeline data (image 3-21).

![Image 3-21](https://user-images.githubusercontent.com/995849/89784293-0324e080-db4b-11ea-975d-6609024aac49.png)\
_Image 3-21，Exported Pipeline Data_

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

### 3.4.3 Export sprint data

It will export a excel file for sprint data. It contains two sheets:

**Sheet1 - Card Statistics:** contains two parts:

**_Part 1:_** Export the all done tickets during the time period

**_Part 2:_** Export the all non-done tickets in your current active board. And it will order by ticket status (Image 3-20)

![Image 3-20](https://user-images.githubusercontent.com/995849/89784291-01f3b380-db4b-11ea-8f5a-d475e80014fb.png)\
_Image 3-20，Exported Board Data_

**_All columns for Jira board:_**
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

**Sheet2 - Iteration Statistics:** Statistics data for all sprints which selected by user(Image 3-22)

![Image 3-22](https://user-images.githubusercontent.com/109513161/185026165-1d16d436-14e5-4531-a266-544fa9ad29fa.png)\
_Image 3-22，Exported Sprint Data_

**_All columns for Iteration：_**
|Column name |Description|
|---|---|
|Standard deviations(population) of cycle time|---|
|Total cycle time|---|
|Total blocked time|---|
|Percentage of developing time|---|
|Percentage of blocked time|---|
|Total blocked time for each block reason|The data for the latest sprint|
|Percentage of blocked time for each reason|The data for the latest sprint|

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
   ![Image 5-1](https://user-images.githubusercontent.com/995849/89785230-a75b5700-db4c-11ea-9ce2-4ff7894bbf25.png)\
   _Image 5-1_

2. You need to enable any items you want to know. In the above page, If you want to change any items' screens, you can click the screens link in the actions column for that item. Then in the next page, check the project you want to change, and update it. Like: Story points
   ![Image 5-2](https://user-images.githubusercontent.com/995849/89785239-ab877480-db4c-11ea-9e82-952777936cf8.png)\
   _Image 5-2_

   ![Image 5-3](https://user-images.githubusercontent.com/995849/89785244-acb8a180-db4c-11ea-958f-663a7efa105c.png)\
   _Image 5-3_

For the next-gen Jira, when you add story points item, the name should be Story Points or Story point estimate.

## 5.2 Prepare env to use HeartBeat tool

For now, we just can download the code in our local machine, please follow below steps:

1. Clone the backend code in your local machine: https://github.com/thoughtworks/HeartBeat/
2. Follow the steps as below

# 6 Run HeartBeat

## Run via Docker

```
$ docker-compose up
```

## 6.1 How to install and run HeartBeat

```shell script
$ cd HearBeat/frontend
$ yarn install #Install node modules for frontend
$ yarn start #Run frontend
```

```shell script
$ cd HearBeat/backend
$ yarn install #Install node modules for backend
$ yarn start #Run backend
$ yarn watch-server #If you can't use yarn start to run backend, please use this script
```

After starting frontend and backend successfully, you can access to `http://localhost:4200` use HeartBeat.

swagger address: `http://localhost:3001/swagger-html`

## 6.2 How to run test

```shell script
$ cd HearBeat/frontend
$ yarn test #Run test for frontend and generate test report
```

You can check frontend test report in `HearBeat/frontend/coverage/index.html`, and use browser to check it.

```shell script
$ cd HearBeat/backend
$ yarn test #Run test for backend
$ yarn test-with-coverage #Run test for backend and generate test report
```

You can check backend test report in `HearBeat/backend/coverage/index.html` , and use browser to check it.

## 6.3 How to build it

```
$ yarn build
```

## 6.4 How to package it (optional)

```shell script
$ cd HearBeat/backend
$ yarn package
```

You can build server to binary file, it will output `Unix Executable File` according to your OS in `HearBeat/backend`：

- heartbeat-backend-linux
- heartbeat-backend-macos
- heartbeat-backend-win.exe

and you can use HeartBeat when open `Unix Executable File`
