import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-medical-checkup-list',
  templateUrl: './edit-medical-checkup-list.component.html',
  styleUrls: ['./edit-medical-checkup-list.component.scss'],
})
export class EditMedicalCheckupListComponent implements OnInit {
  constructor(private router: Router) {}

  navigateToRoomMonitor() {
    this.router.navigate(['/room_monitor']);
  }

  ngOnInit(): void {}
}
