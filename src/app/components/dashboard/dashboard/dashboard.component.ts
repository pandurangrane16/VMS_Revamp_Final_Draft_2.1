import { Component } from '@angular/core';
import { OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js'
import { UserFacadeService } from 'src/app/facade/facade_services/user-facade.service';
import { CommonFacadeService } from 'src/app/facade/facade_services/common-facade.service';
import { Globals } from 'src/app/utils/global';
import * as Highcharts from 'highcharts';
import { ScreenshotListviewComponent } from '../screenshot-listview/screenshot-listview.component';
import { DashboardFacadeService } from 'src/app/facade/facade_services/dashboard-facade.service';

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
  public barMdChartOptions: any;
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
  listViewData: any[] = [];
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
  constructor(private _userfacadeservice: UserFacadeService,
    private _router: Router,
    private _commonFacade: CommonFacadeService,
    private global: Globals,
    private _dashboardFacade: DashboardFacadeService,
    private modalService: NgbModal,) {

    this.global.CurrentPage = "Dashboard";
  }

  // Highcharts: typeof Highcharts = Highcharts;
  dashboardChart: any = [];
  dashboardChart2: any = [];
  vmsList: any = [];

  ngOnInit(): void {
    this.GetChartData();
    setTimeout(() => {
      this.GetChartData2();
    }, 500);
  }
  changeBarChartConfiguration(data: any, type: string) {
    let BarchartOptions: Highcharts.Options = {
      chart: {
        type: 'column'
      },
      title: {
        text: type
      },
      xAxis: {
        categories: ['Pending', 'Approved', 'Rejected']
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Quantity'
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            inside: false,         // Ensures label is outside the bar
            verticalAlign: 'bottom', // Required to anchor at bottom of label box (so it appears above bar)
            align: 'center',       // Center horizontally on bar
            y: -6,                 // Negative Y pushes label slightly above bar
            style: {
              fontWeight: 'bold',
              color: '#000'
            },
            formatter: function () {
              return this.y;       // Show the value
            }
          }
        }
      },
      series: [{
        type: 'column',
        data: data
      }]
    };
    if (type == 'Playlist Audit')
      this.barChartOptions = BarchartOptions;
    else
      this.barMdChartOptions = BarchartOptions;
  }
  ViewScreenshot(data: any) {
    console.log(data);

    const modalRef = this.modalService.open(ScreenshotListviewComponent, { ariaLabelledBy: 'modal-basic-title', size: 'lg' });
    modalRef.componentInstance.data = data;
    modalRef.componentInstance.passEntry.subscribe((receivedEntry: any) => {
    })
  }
  getListViewData() {
    this._dashboardFacade.getListViewData().subscribe(res => {
      if (res != null && res != undefined && res.length > 0) {
        this.listViewData = res;
      }
    })
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
      let active = ((Number(devdata[0]) / (Number(devdata[0]) + Number(devdata[1]))) * 100).toFixed(2);
      let inactive = ((Number(devdata[1]) / (Number(devdata[0]) + Number(devdata[1]))) * 100).toFixed(2);
      this.deviceChartOptions = Highcharts.setOptions({
        chart: { type: 'pie' },
        title: { text: 'Device Status' },
        series: [{
          name: 'Status',
          type: 'pie',
          dataLabels: [{
            //format: '{point.percentage:.1f}%',
            format: '{point.name}: {point.y}',
          }
          ],
          data: [
            { name: 'Active', y: Number(this.dashboardChart.deviceData.active) },
            { name: 'Inactive', y: Number(this.dashboardChart.deviceData.inActive) },
          ]
        }]
      });
      console.log(this.deviceChartOptions);
      let mediadata = [];
      mediadata.push({ y: Number(this.dashboardChart.mediaAudit.pending),color:'#F7F40C', name: 'Pending Media count for approval' });
      mediadata.push({ y: Number(this.dashboardChart.mediaAudit.approved),color:'#09D657', name: 'Approved Playlist count' });
      mediadata.push({ y: Number(this.dashboardChart.mediaAudit.rejected),color:'#F52A05', name: 'Rejected Playlist count for apprval' });

      let pldata = [];
      pldata.push({ y: Number(this.dashboardChart.playlistAudit.pending), color: '#F7F40C', name: 'Pending Playlist count for apprval' });
      pldata.push({ y: Number(this.dashboardChart.playlistAudit.approved), color: '#09D657', name: 'Approved Playlist count' });
      pldata.push({ y: Number(this.dashboardChart.playlistAudit.rejected), color: '#F52A05', name: 'Rejected Playlist count for apprval' });
      this.totalBarChartSize = (Number(this.dashboardChart.playlistAudit.pending) + Number(this.dashboardChart.playlistAudit.rejected) + Number(this.dashboardChart.playlistAudit.approved) + Number(this.dashboardChart.mediaAudit.pending) + Number(this.dashboardChart.mediaAudit.rejected) + Number(this.dashboardChart.mediaAudit.approved));
      this.changeBarChartConfiguration(pldata, 'Playlist Audit');
      this.changeBarChartConfiguration(mediadata, 'Media Audit');
      this.barChartOptions
      this.chartDataDevice = {
        labels: ['Enable', 'Disable',],
        datasets: [
          {
            data: devdata,
          }
        ]
      };

      // this.mediaData = {
      //   labels: ["Peding", "Rejected", "Approved"],
      //   datasets: [
      //     {
      //       data: mediadata,
      //       backgroundColor: [
      //         'rgba(153, 102, 255, 1)',
      //         'rgba(247, 33, 79, 1)',
      //         'rgba(81, 200, 28, 1)',
      //       ]
      //     }
      //   ]
      // };

      // this.PlaylistData = {
      //   labels: ["Peding", "Rejected", "Approved"],
      //   datasets: [
      //     {
      //       data: pldata,
      //       backgroundColor: [
      //         'rgba(153, 102, 255, 1)',
      //         'rgba(247, 33, 79, 1)',
      //         'rgba(81, 200, 28, 1)',
      //       ]
      //     }
      //   ]
      // };
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
  partyMediaChartOptions: any;
  GetChartData2() {
    this._userfacadeservice.GetPartyWiseMedia().subscribe((res: any[]) => {
      const xAxisLabels: string[] = [];
      const yAxisData: number[] = [];

      res.forEach((ele: any) => {
        xAxisLabels.push(ele.partyName);
        yAxisData.push(ele.mediaCount);
      });
      this.partyMediaChartOptions = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Party Wise Media Count'
        },
        xAxis: {
          categories: xAxisLabels,
          title: {
            text: 'Party Name'
          }
        },
        yAxis: {
          min: 0,
          max: 1000,
          title: {
            text: 'Media Count'
          }
        },
        tooltip: {
          pointFormat: 'Media Count: <b>{point.y}</b>'
        },
        plotOptions: {
          column: {
            colorByPoint: true,
            // dataLabels: {
            //   enabled: true,
            //   formatter: function () {
            //      return this.y?.toString() ?? '';
            //   },
            //   style: {
            //     fontWeight: 'bold',
            //     fontSize: '13px',
            //     color: '#000000'
            //   }
            // }
          },

          // series: {                                                   
          //   dataLabels: {
          //     enabled: true,
          //     formatter: function () {
          //    return this.y?.toString() ?? '';
          //     }
          //   }
          // }
        },
        series: [{
          name: 'Media Count',
          type: 'column',
          data: yAxisData
        }],
        colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', '#f15c80']
      } as Highcharts.Options;

      this.getListViewData();
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
