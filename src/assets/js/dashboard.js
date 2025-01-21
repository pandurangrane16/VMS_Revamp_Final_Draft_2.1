(function($) {
  'use strict';
  $(function() {
    var dataBar = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [{
        label: 'Customers',
        data: [5, 10, 15, 12, 10, 8, 6, 4],
        backgroundColor: [
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#fc381d',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
        ],
        borderColor: [
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#fc381d',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
        ],
        borderWidth: 1,
        fill: false
      }]
    };
    var optionsBar = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
            
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        }
      },
      tooltips: {
        enabled: false
      }
  
    };
    if ($("#customers").length) {
      var barChartCanvas = $("#customers").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var ctx = document.getElementById("customers");
      ctx.height = 60;
      var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: dataBar,
        options: optionsBar
      });
    }
    var dataBarOrder = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      datasets: [{
        label: 'Customers',
        data: [5, 5, 5, 5, 10, 5, 5, 5],
        backgroundColor: [
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#51c81c',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
        ],
        borderColor: [
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
          '#51c81c',
          '#dee5ef',
          '#dee5ef',
          '#dee5ef',
        ],
        borderWidth: 1,
        fill: false
      }]
    };
    var optionsBarOrder = {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
            
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          ticks: {
            beginAtZero: true,
            display: false,
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }]
      },
      legend: {
        display: false
      },
      elements: {
        point: {
          radius: 0
        }
      },
      tooltips: {
        enabled: false
      }
  
    };
    if ($("#orders").length) {
      var barChartCanvas = $("#orders").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var ctx = document.getElementById("orders");
      ctx.height = 60;
      var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: dataBarOrder,
        options: optionsBarOrder
      });
    }
    var webAudienceMetricsSatackedData = {
      labels: ["Pepsi", "Coke", "Patanjali", "Government Ad"],
      datasets: [
        {
          label: 'Sessions',
          data: [24000,83123,24000,36000,20000,39000,72000,44000,18000],
          backgroundColor: [
            '#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc',
          ],
          borderColor: [
            '#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc','#3794fc',
          ],
          borderWidth: 1,
          fill: false
        },
        {
        label: 'New Ads',
        data: [35000,3333,58000,32000,15000,37000,41000,32000,22000],
        backgroundColor: [
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
        ],
        borderColor: [
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
          '#a037fc',
        ],
        borderWidth: 1,
        fill: false
      }]
    };
    var webAudienceMetricsSatackedOptions = {
      scales: {
        xAxes: [{
          barPercentage: 0.2,
          stacked: true,
          gridLines: {
            display: true, //this will remove only the label
						drawBorder: false,
						color: "#e5e9f2",
          },
        }],
        yAxes: [{
          stacked: true,
					display: false,
					gridLines: {
            display: false, //this will remove only the label
            drawBorder: false
          },
        }]
      },
      legend: {
        display: false,
        position: "bottom"
      },
      legendCallback: function(chart) {	
				var text = [];
        text.push('<div class="row">');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push('<div class="col-lg-6"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">' + chart.data.datasets[i].data[1].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-9 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></span><p class="text-muted m-0 ml-1">' + chart.data.datasets[i].label + '</p></div></div>');
          text.push('</div>');
        }
        text.push('</div>');
        return text.join("");
      },
      elements: {
        point: {
          radius: 0
        }
      } 
    };
    if ($("#web-audience-metrics-satacked").length) {
      var barChartCanvas = $("#web-audience-metrics-satacked").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var ctx = document.getElementById("web-audience-metrics-satacked");
      ctx.height = 88;
      var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        height: '200',
        data: webAudienceMetricsSatackedData,
        options: webAudienceMetricsSatackedOptions
      });
      document.getElementById('chart-legends').innerHTML = barChart.generateLegend();
		}
		var marketTrendsSatackedData = {
      labels: ["S", "M", "T", "W", "T", "F", "S"],
      datasets: [
        {
          label: 'Total Income',
          data: [86000,83320,36000,80000,92000,58000,76000],
          backgroundColor: [
            '#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c',
          ],
          borderColor: [
            '#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c','#51c81c',
          ],
          borderWidth: 1,
          fill: false
        },
      	{
        label: 'Total Expenses',
        data: [59000,32370,84000,65000,53000,87000,60900],
        backgroundColor: [
          '#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef',
        ],
        borderColor: [
          '#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef','#dee5ef',
        ],
        borderWidth: 1,
        fill: false
      },]
    };
    var marketTrendsSatackedOptions = {
      scales: {
        xAxes: [{
          barPercentage: 0.35,
          stacked: true,
          gridLines: {
            display: false, //this will remove only the label
						drawBorder: false,
						color: "#e5e9f2",
          },
        }],
        yAxes: [{
          stacked: true,
					display: false,
					gridLines: {
            display: false, //this will remove only the label
            drawBorder: false
          },
        }]
      },
      legend: {
        display: false,
        position: "bottom"
      },
      legendCallback: function(chart) {	
				var text = [];
        text.push('<div class="row">');
        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push('<div class="col-lg-6"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">' + chart.data.datasets[i].data[1].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-9 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></span><p class="text-muted m-0 ml-1">' + chart.data.datasets[i].label + '</p></div></div>');
          text.push('</div>');
        }
        text.push('</div>');
        return text.join("");
      },
      elements: {
        point: {
          radius: 0
        }
      } 
    };
    if ($("#marketTrendssatacked").length) {
      var barChartCanvas = $("#marketTrendssatacked").get(0).getContext("2d");
      // This will get the first returned node in the jQuery collection.
      var barChart = new Chart(barChartCanvas, {
        type: 'bar',
        data: marketTrendsSatackedData,
        options: marketTrendsSatackedOptions
      });
      document.getElementById('chart-legends-market-trend').innerHTML = barChart.generateLegend();
    }
    $('#over-all-rating').barrating({
      theme: 'fontawesome-stars',
      showSelectedRating: false
    });
  });

  // Ad Chart

  if ($("#addParty").length) {
    var barChartCanvas2 = $("#addParty").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var ctx2 = document.getElementById("addParty");
    ctx2.height = 130;
    
    var barChart2 = new Chart(barChartCanvas2, {
      type: 'bar',
    data: {
      labels: ["Pepsi", "Coke", "Patanjali", "Government"],
      datasets: [{
        label: 'Total Ads',
        data: [12, 15, 13, 24],
        backgroundColor: [
          '#0a0198','#d7091c','#dc4908','#ec37fc'
        ],
        borderColor: [
          '#0a0198','#d7091c','#dc4908','#ec37fc'
        ],
        borderWidth: 1
      }
    ]
    },
    options: {
      responsive: true,
       legend: {
        display: false,
        position: "bottom"
      },
      legendCallback: function(chart) {	
				var text = [];
        text.push('<div class="row">'); 
        for (var i = 0; i < chart.data.datasets.length; i++) {
          text.push('<div class="col-lg-3"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">'+ chart.data.datasets[i].data[i].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-9 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i] + '"></span><p class="text-dark m-0 ml-1">'+ chart.data.labels[i].toLocaleString()   + '</p></div></div>');
          text.push('</div> <div class="col-lg-3"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">'+ chart.data.datasets[i].data[i+1].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-9 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i+1] + '"></span><p class="text-dark m-0 ml-1">'+ chart.data.labels[i+1].toLocaleString()   + '</p></div></div>');
          text.push('</div> <div class="col-lg-3"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">'+ chart.data.datasets[i].data[i+2].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-9 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i+2] + '"></span><p class="text-dark m-0 ml-1">'+ chart.data.labels[i+2].toLocaleString()  + '</p></div></div>');
          text.push('</div> <div class="col-lg-3"><div class="row"><div class="col-sm-12"><h5 class="font-weight-bold text-dark mb-1">'+ chart.data.datasets[i].data[i+3].toLocaleString() + '</h5></div></div><div class="row align-items-center"><div class="col-12 pl-0"><span class="legend-label mt-1" style="background-color:' + chart.data.datasets[i].backgroundColor[i+3] + '"></span><p class="text-dark m-0 ml-1">'+ chart.data.labels[i+3].toLocaleString()   + '</p></div></div>');
        }
        text.push('</div>');
        return text.join("");
      },
      elements: {
        point: {
          radius: 0
        }
      } ,
      scales: {
        xAxes: [{
          barThickness: 26,  // number (pixels) or 'flex'
                maxBarThickness: 30, // number (pixels)
          // ticks: {
          //   maxRotation: 90,
          //   minRotation: 80
          // },
            gridLines: {
            offsetGridLines: true // à rajouter
          }
        },
        { display: false,
          position: "top",
          // ticks: {
          //   maxRotation: 90,
          //   minRotation: 80
          // },
          gridLines: {
            offsetGridLines: true // et matcher pareil ici
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }

    });
   
    document.getElementById('chart-legends2').innerHTML = barChart2.generateLegend();
  }




//Media Audit Chart

  var mediadata = {
    labels: ["Peding", "Rejected", "Aproved"],
    datasets: [{
      label: 'Media',
      data: [12, 19, 13],
      backgroundColor: [
        'rgba(153, 102, 255, 1)',
        'rgba(247, 33, 79, 1)',
        'rgba(81, 200, 28, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
        
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  var mediaoptions = {
   
    scales: {
      xAxes: [{
        barThickness: 10,  // number (pixels) or 'flex'
        maxBarThickness: 10, // number (pixels)
        ticks: {
          beginAtZero: true,
        }
      }
      
    ],
      yAxes: [{
        barPercentage: 0.50,
        gridLines: {
          display: true,
          drawTicks: true,
          drawOnChartArea: false
        },
        ticks: {
          padding: 5,
          beginAtZero: true,
          fontColor: '#555759',
          fontFamily: 'Lato',
          fontSize: 11,
         
            
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };

  if ($("#mediaChart").length) {
    var mediaChartCanvas = $("#mediaChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var mediaChart = new Chart(mediaChartCanvas, {
      type: 'horizontalBar',
      data: mediadata,
      options: mediaoptions
    });
  }


  //Playlist Audit Chart

  var playlistdata = {
    labels: ["Peding", "Rejected", "Aproved"],
    datasets: [{
      label: 'Playlist',
      data: [12, 19, 13],
      backgroundColor: [
        'rgba(153, 102, 255, 1)',
        'rgba(247, 33, 79, 1)',
        'rgba(81, 200, 28, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)'
        
      ],
      borderWidth: 1,
      fill: false
    }]
  };

  var playlistoptions = {
    scales: {
      xAxes: [{
        barThickness: 10,  // number (pixels) or 'flex'
        maxBarThickness: 20, // number (pixels)
        ticks: {
          beginAtZero: true,
        }
      }
      
    ],
      yAxes: [{
        barPercentage: 0.50,
        gridLines: {
          display: true,
          drawTicks: true,
          drawOnChartArea: false
        },
        ticks: {
          padding: 5,
          beginAtZero: true,
          fontColor: '#555759',
          fontFamily: 'Lato',
          fontSize: 11,
         
            
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    }

  };

  if ($("#playlistChart").length) {
    var playlistChartCanvas = $("#playlistChart").get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    var playlistChart = new Chart(playlistChartCanvas, {
      type: 'horizontalBar',
      data: playlistdata,
      options: playlistoptions
    });
  }
 
// Device Status


var deviceChartData = {
  datasets: [{
    data: [30, 70],
    backgroundColor: [
      'rgba(81, 200, 28, 1)',
      'rgba(144, 156, 139, 1)',
      'rgba(153, 102, 255, 1)',
        'rgba(247, 33, 79, 1)',
         'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ]
  }],

  // These labels appear in the legend and in the tooltips when hovering different arcs
  labels: [
    'Enable',
    'Disable',

  ]
};
var deviceChartOptions = {
  responsive: true,
    legend: {
       display: true,
       position: 'top',
       fullWidth: false,
       labels: {
         boxWidth: 10,
        //  padding: 50
       }
    },
  animation: {
    animateScale: true,
    animateRotate: true
  }
  
};



  if ($("#deviceChart").length) {
    var deviceChartCanvas = $("#deviceChart").get(0).getContext("2d");
   
    var deviceChart = new Chart(deviceChartCanvas, {
      type: 'pie',
      data: deviceChartData,
      options: deviceChartOptions
    });
   
  }

  
})(jQuery);

$(document).ready(function () {
  $('#vmsList').DataTable({
    "lengthMenu": [ [8, 10, 25, 50, -1], [8, 10, 25, 50, "All"] ]
  });

});