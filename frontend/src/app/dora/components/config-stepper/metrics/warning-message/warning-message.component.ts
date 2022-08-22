import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-warning-message',
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.scss'],
})
export class WarningMessageComponent implements OnInit {
  @Input() warningMessagesForImport: string[];

  constructor() {}

  ngOnInit(): void {}
}
