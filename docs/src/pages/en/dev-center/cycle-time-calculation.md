---
title: CycleTime calculation
description: CycleTime calculation
layout: ../../../layouts/MainLayout.astro
---

## Undone card
### Definition
- **In current open sprint and status not in real done status.**

> example:
>
> Real done columns: **'Testing' and 'Done'**
> - card A in 'In Dev' column
> - card B in 'Review' column
> - card C in 'Testing' column
> 
> Result: card A and B are undone cards

### JQL to get undone cards
```java
private JiraCardWithFields getAllNonDoneCardsForActiveSprint(URI baseUrl, List<String> status, BoardRequestParam boardRequestParam) {
    String jql;
    if (status.isEmpty()) {
        jql = "sprint in openSprints() ";
    }
    else {
        jql = "sprint in openSprints() AND status not in ('" + String.join("','", status) + "')";
    }

    return getCardList(baseUrl, boardRequestParam, jql, "nonDone");
}
```
	
---

## Done card
### Definition
- **The earliest time move to real done column is in the date range user selected**

> example:
>
> selected date range: **2023.8.7 ~ 2023.8.20**
> 
> Real done columns: **'Testing' and 'Done'**
> - card A moved to 'Testing' column in 2023.8.6 and moved 'Done' column in 2023.8.21
> - card B moved to 'Testing' column in 2023.8.15
> - card C moved to 'Done' column in 2023.8.21
>
> Result: card A and B are done cards

---

## OriginCycleTime implementation of export board data

- **Red line**: OriginCycleTime：FLAG
- **Purple line**: OriginCycleTime：BLOCK
- **Green line**: Block days when Set Consider the "Flag" as "Block" is False.
- **Red line + Purple line**: Block days when Set Consider the "Flag" as "Block" is True.

### Scenarios

| Number | Description                                                                            | Timeline diagram                                                                                                                  | OriginCycleTime：FLAG                     | OriginCycleTime: BLOCK                       |
| :----- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| 1      | Move to Block column after flag duration                                               | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/block-after-flag.png)                | Time between `Add flag` and `Remove flag` | Time in block column                         |
| 2      | Move out Block column before flag duration                                             | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/block-before-flag.png)               | Time between `Add flag` and `Remove flag` | Time in block column                         |
| 3      | Block column duration within flag duration                                             | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/block-witnin-flag.png)               | Time between `Add flag` and `Remove flag` | 0                                            |
| 4      | Flag duration within Block duration                                                    | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/flag-within-block.png)               | Time between `Add flag` and `Remove flag` | Time in block column - Flag duration         |
| 5      | Block duration partial cross flag duration and block start time before flag start time | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/block-partial-cross-flag-before.png) | Time between `Add flag` and `Remove flag` | Time in block column - Partial Flag duration |
| 6      | Block duration partial cross flag duration and block end time after flag end time      | ![img.png](https://cdn.staticaly.com/gh/au-heartbeat/data-hosting@main/origincycletime-image/block-partial-cross-flag-after.png)  | Time between `Add flag` and `Remove flag` | Time in block column - Partial Flag duration |
