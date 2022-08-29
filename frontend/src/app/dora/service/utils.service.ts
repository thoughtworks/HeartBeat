import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor() {}

  exportToJsonFile({ fileName, json }: { fileName: string; json: string }) {
    const dataStr = JSON.stringify(json, null, 4);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.href = dataUri;
    linkElement.download = fileName;
    linkElement.click();
  }

  convertStartTimeToTimestamp(date: Date, time: string = '00:00:00') {
    return this.convertToTimestamp(date, time);
  }

  convertEndTimeToTimestamp(date: Date, time: string = '23:59:59') {
    return this.convertToTimestamp(date, time);
  }

  convertToTimestamp(date: Date, time: string) {
    const dateString = new Date(date).toLocaleDateString('en-US');
    return new Date(`${dateString} ${time}`).getTime();
  }
}
