import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js'
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { Globals } from 'src/app/utils/global';
import * as Highcharts from 'highcharts';

declare let $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalBarChartSize: number = 20;
  Highcharts: typeof Highcharts = Highcharts;
  deviceChartOptions: any;
  chartDataDevice: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        data: [],
      }
    ]
  };

  // chartOptions: Highcharts.Options = {
  //   chart: { type: 'column' },
  //   title: { text: 'Monthly Sales' },
  //   xAxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr'] },
  //   yAxis: { title: { text: 'Sales' } },
  //   series: [{
  //     name: '2024',
  //     type: 'column',
  //     data: [29, 71, 106, 129]
  //   }]
  // };

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: false,
        text: 'Device Status',

      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 10,
          //  padding: 50
        }
      },
    },

  };

  public barChartOptions: any;
  public barChartType: ChartType = 'bar';


  public mediaData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(247, 33, 79, 1)',
          'rgba(81, 200, 28, 1)',
        ],
        barThickness: 25,
        maxBarThickness: 40,
        barPercentage: 0.50,

      },

    ]
  };


  public PlaylistData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(153, 102, 255, 1)',
          'rgba(247, 33, 79, 1)',
          'rgba(81, 200, 28, 1)',
        ],
        barThickness: 25,
        maxBarThickness: 40,
        barPercentage: 0.50,

      },

    ]
  };

  public AdsOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        min: 0,
        max: 100000
      },
      y: {
        min: 0,
        max: 100000
      }
    },
    plugins: {
      legend: {
        display: false,
      },

    },
  };

  public AdsData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        barThickness: 35,
        maxBarThickness: 40,
        barPercentage: 0.50,
      },

    ]

  };
  //   public AdsData: ChartData<'bar'> = {
  //     labels: ["Pepsi", "Coke", "Patanjali", "Government"],
  //     datasets: [
  //      { data: [12,19,13,24],
  //        backgroundColor: [
  //          'rgba(153, 102, 255, 1)',
  //        'rgba(247, 33, 79, 1)',
  //        'rgba(81, 200, 28, 1)',
  //        'rgba(255, 159, 64, 1)',
  //     ] ,
  //     barThickness: 35,
  //     maxBarThickness: 40,
  //     barPercentage: 0.50,

  //    },

  //    ]

  // } ;

  constructor(private _userfacadeservice: UserFacadeService,
    private _router: Router,
    private _commonFacade: CommonFacadeService,
    private global: Globals) {
    this.global.CurrentPage = "Dashboard";
  }
  dashboardChart: any = [];
  vmsList: any = [];

  ngOnInit(): void {
    this.GetChartData();
  }
  changeBarChartConfiguration() {
    let barChartConfig: ChartConfiguration['options'] = {
      responsive: true,
      indexAxis: 'y',
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {
          min: 0,
          max: this.totalBarChartSize
        },
        y: {
          min: 0,
          max: this.totalBarChartSize
        }
      },
      plugins: {
        legend: {
          display: false,
        },

      }
    };
    this.barChartOptions = barChartConfig;
  }
  GetChartData() {
    this._userfacadeservice.GetDashboardCharts().subscribe(res => {
      this.dashboardChart = res;
      let devdata = [];
      let adslabels: any[] = [];
      let adsCounts: any[] = [];
      let backgroundColors: any[] = [];
      devdata.push(this.dashboardChart.deviceData.active);
      devdata.push(this.dashboardChart.deviceData.inActive);

      this.deviceChartOptions = Highcharts.setOptions({
        chart: { type: 'pie' },
        title: { text: 'Market Share' },
        series: [{
          name: 'Share',
          type: 'pie',
          data: [
            { name: 'Active', y: Number(devdata[1])},
            { name: 'Inactive', y: Number(devdata[1])},
          ]
        }]
      });
      console.log(this.deviceChartOptions);
      let mediadata = [];
      mediadata.push(this.dashboardChart.mediaAudit.pending);
      mediadata.push(this.dashboardChart.mediaAudit.rejected);
      mediadata.push(this.dashboardChart.mediaAudit.approved);

      let pldata = [];
      pldata.push(this.dashboardChart.playlistAudit.pending);
      pldata.push(this.dashboardChart.playlistAudit.rejected);
      pldata.push(this.dashboardChart.playlistAudit.approved);
      this.totalBarChartSize = (Number(this.dashboardChart.playlistAudit.pending) + Number(this.dashboardChart.playlistAudit.rejected) + Number(this.dashboardChart.playlistAudit.approved) + Number(this.dashboardChart.mediaAudit.pending) + Number(this.dashboardChart.mediaAudit.rejected) + Number(this.dashboardChart.mediaAudit.approved));
      this.changeBarChartConfiguration();
      this.barChartOptions
      this.chartDataDevice = {
        labels: ['Enable', 'Disable',],
        datasets: [
          {
            data: devdata,
          }
        ]
      };

      this.mediaData = {
        labels: ["Peding", "Rejected", "Approved"],
        datasets: [
          {
            data: mediadata,
            backgroundColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(247, 33, 79, 1)',
              'rgba(81, 200, 28, 1)',
            ]
          }
        ]
      };

      this.PlaylistData = {
        labels: ["Peding", "Rejected", "Approved"],
        datasets: [
          {
            data: pldata,
            backgroundColor: [
              'rgba(153, 102, 255, 1)',
              'rgba(247, 33, 79, 1)',
              'rgba(81, 200, 28, 1)',
            ]
          }
        ]
      };
      res.topPartiesData.forEach((ele: any) => {
        adslabels.push(ele.partyName);
        adsCounts.push(ele.adCount);
        backgroundColors.push(this.randomRGB());
      });
      this.AdsData = {
        labels: adslabels,
        datasets: [
          {
            data: adsCounts,
            backgroundColor: backgroundColors
          }
        ]
      }
    });
  }

  randomRGB() {
    var x = Math.floor(Math.random() * 256);
    var y = Math.floor(Math.random() * 256);
    var z = Math.floor(Math.random() * 256);
    var RGBColor = "rgb(" + x + "," + y + "," + z + ")";
    return RGBColor;
  }
}
