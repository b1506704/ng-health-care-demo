import { Component, OnDestroy, OnInit } from '@angular/core';
import { Doctor } from 'src/app/shared/models/doctor';
import { DoctorStore } from 'src/app/shared/services/doctor/doctor-store.service';
import { ScreenService } from 'src/app/shared/services/screen.service';

@Component({
  selector: 'app-doctor-statistics',
  templateUrl: './doctor-statistics.component.html',
  styleUrls: ['./doctor-statistics.component.scss'],
})
export class DoctorStatisticsComponent implements OnInit, OnDestroy {
  barChartTitle: string = 'Doctor By Role';
  barChartSubtitle: string = 'Role Category';
  funnelChartTitle: string = 'Doctor By Department';
  funnelChartSubtitle: string = 'Department Summary';
  lineChartTitle: string = 'Doctor By Age';
  lineChartSubtitle: string = 'Years of Experience';
  polarChartTitle: string = 'Doctor By Virus Test';
  polarChartSubtitle: string = 'Positive Virus Test';
  pieChartTitle: string = 'Doctor By Gender';
  pieChartSubtitle: string = 'Total Male/Female Percentage';
  loadingIndicator: Object = {
    enabled: true,
    backgroundColor: 'white',
    font: { color: 'white', family: 'hero', size: '50px', weight: 'bold' },
  };
  visualLineRange: any = {};
  visualPolarRange: any = {};
  zoomingData: Array<any>;
  doctorList!: Array<Doctor>;
  barChartSource: Array<Object> = [
    {
      role: '',
      totalCount: '',
    },
  ];
  funnelChartSource: Array<Object> = [
    {
      department: '',
      totalCount: '',
    },
  ];
  pieChartSource: Array<Object> = [
    {
      gender: '',
      totalCount: '',
    },
  ];
  chartHeight: number | string = 500;
  chartWidth: number | string = 1000;

  constructor(
    private doctorStore: DoctorStore,
    private screen: ScreenService
  ) {}

  onPointClick(e: any) {
    e.target.select();
  }

  customizeLabel(arg) {
    return arg.valueText + ' (' + arg.percentText + ')';
  }

  barChartSourceListener() {
    this.doctorStore.getRoleStatistics();
    return this.doctorStore.$roleStatistics.subscribe((data: any) => {
      this.barChartSource = data;
    });
  }

  funnelChartSourceListener() {
    this.doctorStore.getDepartmentStatistics();
    return this.doctorStore.$departmentStatistics.subscribe((data: any) => {
      this.funnelChartSource = data;
    });
  }

  pieChartSourceListener() {
    this.doctorStore.getGenderStatistics();
    return this.doctorStore.$genderStatistics.subscribe((data: any) => {
      this.pieChartSource = data;
    });
  }

  sourceDataListener() {
    return this.doctorStore.$doctorList.subscribe((data: any) => {
      this.doctorList = data;
    });
  }

  ngOnInit(): void {
    const isXSmall = this.screen.sizes['screen-x-small'];
    console.log('SCREEN XSMALL');
    console.log(isXSmall);
    if (isXSmall === true) {
      this.chartHeight = 310;
      this.chartWidth = 310;
    } else {
      this.chartHeight = 600;
      this.chartWidth = 600;
    }
    this.barChartSourceListener();
    this.funnelChartSourceListener();
    this.pieChartSourceListener();
    this.sourceDataListener();
    setTimeout(() => {
      this.doctorStore.initData(0, 50);
    }, 150);
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.funnelChartSourceListener().unsubscribe();
    this.barChartSourceListener().unsubscribe();
    this.pieChartSourceListener().unsubscribe();
  }
}
