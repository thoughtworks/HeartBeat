import { expect } from "chai";
import "mocha";
import {
  calculateWorkDaysBetween,
  calculateWorkDaysBy24Hours,
  loadHolidayList,
} from "../../../src/services/common/WorkDayCalculate";
import { mock } from "../../TestTools";
import Holiday2019 from "../../fixture/Holiday-2019.json";
import Holiday2020 from "../../fixture/Holiday-2020.json";

describe("WorkDayCalculate", () => {
  before(async function () {
    this.timeout(10000);
    mock.onGet("2019.json").reply(200, Holiday2019);
    mock.onGet("2020.json").reply(200, Holiday2020);
    await loadHolidayList(2019);
    await loadHolidayList(2020);
  });

  it("should return work days between two date", async () => {
    expect(
      calculateWorkDaysBetween(
        new Date("2019-5-1").getTime(),
        new Date("2019-5-31").getTime()
      )
    ).to.equal(21);

    expect(
      calculateWorkDaysBetween(
        new Date("2019-12-1").getTime(),
        new Date("2020-1-31").getTime()
      )
    ).to.equal(39);

    //search total work days in 2020 on google always get the wrong answer, so I have to count every month's result one by one
    expect(
      calculateWorkDaysBetween(
        new Date("2020-1-1").getTime(),
        new Date("2020-1-31").getTime()
      )
    ).to.equal(17);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-2-1").getTime(),
        new Date("2020-2-29").getTime()
      )
    ).to.equal(20);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-3-1").getTime(),
        new Date("2020-3-31").getTime()
      )
    ).to.equal(22);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-4-1").getTime(),
        new Date("2020-4-30").getTime()
      )
    ).to.equal(22);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-5-1").getTime(),
        new Date("2020-5-31").getTime()
      )
    ).to.equal(19);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-6-1").getTime(),
        new Date("2020-6-30").getTime()
      )
    ).to.equal(21);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-7-1").getTime(),
        new Date("2020-7-31").getTime()
      )
    ).to.equal(23);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-8-1").getTime(),
        new Date("2020-8-31").getTime()
      )
    ).to.equal(21);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-9-1").getTime(),
        new Date("2020-9-30").getTime()
      )
    ).to.equal(23);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-10-1").getTime(),
        new Date("2020-10-31").getTime()
      )
    ).to.equal(17);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-11-1").getTime(),
        new Date("2020-11-30").getTime()
      )
    ).to.equal(21);
    expect(
      calculateWorkDaysBetween(
        new Date("2020-12-1").getTime(),
        new Date("2020-12-31").getTime()
      )
    ).to.equal(23);

    expect(
      calculateWorkDaysBetween(
        new Date("2020-1-1").getTime(),
        new Date("2020-12-31").getTime()
      )
    ).to.equal(249);
  });
});
describe("calculateWorkDayTimesBetween", () => {
  before(async function () {
    this.timeout(10000);
    mock.onGet("20 19.json").reply(200, Holiday2019);
    mock.onGet("2020.json").reply(200, Holiday2020);
    await loadHolidayList(2019);
    await loadHolidayList(2020);
  });

  it("should return work days times between two date", async () => {
    let startTime = new Date(2020, 4, 18, 10, 0, 0, 0).getTime();
    let endTime = new Date(2020, 4, 18, 16, 0, 0, 0).getTime();

    expect(calculateWorkDaysBy24Hours(startTime, endTime)).to.equal(0.25);

    startTime = new Date(2020, 4, 18, 10, 0, 0, 0).getTime();
    endTime = new Date(2020, 4, 19, 16, 0, 0, 0).getTime();

    expect(calculateWorkDaysBy24Hours(startTime, endTime)).to.equal(1.25);

    startTime = new Date(2020, 4, 16, 10, 0, 0, 0).getTime();
    endTime = new Date(2020, 4, 17, 16, 0, 0, 0).getTime();

    expect(calculateWorkDaysBy24Hours(startTime, endTime)).to.equal(0);
  });
});
