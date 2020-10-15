import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/dora/service/api.service';
import moment from 'moment';

@Component({
  selector: 'app-export-csv',
  templateUrl: './export-csv.component.html',
  styleUrls: ['./export-csv.component.scss'],
})
export class ExportCsvComponent implements OnInit {
  @Input() includeBoardData: boolean;
  @Input() includePipelineData: boolean;
  @Input() csvTimeStamp: number;

  constructor(private apiService: ApiService) {}

  ngOnInit() {}

  parseTimeStampToHumanDate(): string {
    return moment(this.csvTimeStamp).format('YYYY-MM-DD');
  }

  downloadBoardCsv() {
    this.apiService.fetchExportData('board', this.csvTimeStamp).subscribe((res) => {
      const exportedFilenmae = `board-data-${this.parseTimeStampToHumanDate()}.csv`;
      const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  downloadPipelineCsv() {
    this.apiService.fetchExportData('pipeline').subscribe((res) => {
      const exportedFilenmae = 'pipeline-data.csv';
      const blob = new Blob([res], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }
}
