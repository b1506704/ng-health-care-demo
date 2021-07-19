import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Customer } from 'src/app/shared/models/customer';
import { CustomerStore } from 'src/app/shared/services/customer/customer-store.service';

@Component({
  selector: 'app-transaction-statistics',
  templateUrl: './transaction-statistics.component.html',
  styleUrls: ['./transaction-statistics.component.scss'],
})
export class TransactionStatisticsComponent implements OnInit, OnDestroy {
  barChartTitle: string = 'Customer By Blood Type';
  barChartSubtitle: string = 'B.Type Category';
  funnelChartTitle: string = 'Customer By Occupation';
  funnelChartSubtitle: string = 'Job count';
  lineChartTitle: string = 'Customer By Age';
  lineChartSubtitle: string = 'Height and Weight';
  polarChartTitle: string = 'Customer By Virus Test';
  polarChartSubtitle: string = 'Positive Virus Test';
  pieChartTitle: string = 'Customer By Gender';
  pieChartSubtitle: string = 'Total Male/Female Percentage';
  loadingIndicator: Object = {
    enabled: true,
    backgroundColor: 'white',
    font: { color: 'white', family: 'hero', size: '50px', weight: 'bold' },
  };
  visualLineRange: any = {};
  visualPolarRange: any = {};
  zoomingData: Array<any>;
  customerList!: Array<Customer>;
  barChartSource: Array<Object> = [
    {
      bloodType: '',
      totalCount: '',
    },
  ];
  funnelChartSource: Array<Object> = [
    {
      job: '',
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
  pageSize: number = 50;
  currentIndexFromServer: number;

  constructor(private customerStore: CustomerStore, private router: Router) {}

  customizeTooltip = (info: any) => {
    return {
      html:
        "<div><div class='tooltip-header'>" +
        `Age: ${info.argumentText}` +
        '</div>' +
        "<div class='tooltip-body'><div class='series-name'>" +
        "<span class='top-series-name'>" +
        info.points[0].seriesName +
        '</span>' +
        ": </div><div class='value-text'>" +
        "<span class='top-series-value'>" +
        info.points[0].valueText +
        '</span>' +
        "</div><div class='series-name'>" +
        "<span class='bottom-series-name'>" +
        info.points[1].seriesName +
        '</span>' +
        ": </div><div class='value-text'>" +
        "<span class='bottom-series-value'>" +
        info.points[1].valueText +
        '</span>' +
        '</div></div></div>',
    };
  };

  loadMoreData() {
    this.customerStore.loadDataAsync(
      this.currentIndexFromServer + 1,
      this.pageSize
    );
  }

  onPointClick(e: any) {
    e.target.select();
  }

  customizeLabel(arg) {
    return arg.valueText + ' (' + arg.percentText + ')';
  }

  barChartSourceListener() {
    this.customerStore.getBloodTypeStatistics();
    return this.customerStore.$bloodTypeStatistics.subscribe((data: any) => {
      this.barChartSource = data;
    });
  }

  funnelChartSourceListener() {
    this.customerStore.getJobStatistics();
    return this.customerStore.$jobStatistics.subscribe((data: any) => {
      this.funnelChartSource = data;
    });
  }

  pieChartSourceListener() {
    this.customerStore.getGenderStatistics();
    return this.customerStore.$genderStatistics.subscribe((data: any) => {
      this.pieChartSource = data;
    });
  }

  sourceDataListener() {
    return this.customerStore.$customerList.subscribe((data: any) => {
      this.customerList = data;
    });
  }

  currentPageListener() {
    return this.customerStore.$currentPage.subscribe((data: any) => {
      this.currentIndexFromServer = data;
    });
  }

  navigateToEditTheme() {
    this.router.navigate(['/edit_theme']);
  }

  ngOnInit(): void {
    this.barChartSourceListener();
    this.funnelChartSourceListener();
    this.pieChartSourceListener();
    this.sourceDataListener();
    this.currentPageListener();
  }

  ngOnDestroy(): void {
    this.sourceDataListener().unsubscribe();
    this.funnelChartSourceListener().unsubscribe();
    this.barChartSourceListener().unsubscribe();
    this.pieChartSourceListener().unsubscribe();
    this.currentPageListener().unsubscribe();
  }
}
