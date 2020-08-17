import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImportConfigService } from '../../service/import-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private importConfigService: ImportConfigService) {}

  ngOnInit(): void {}

  createNewProject() {
    this.importConfigService.set(null);
    this.router.navigate(['/dora/config']);
  }

  importProject(event: any): void {
    const input = event.target;
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        this.importConfigService.set(reader.result);
        this.router.navigateByUrl('/dora/config', {
          state: {
            data: reader.result.toString(),
          },
        });
      }
    };
    reader.readAsText(input.files[0], 'utf-8');
  }
}
