import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';

@Injectable()
export class HighchartsService {
chartOptions;
  constructor() {
  }

  createChart(container, chartData, options?: object) {
    this.chartOptions = {
       chart : {
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: 'transparent'
       },
       colors: ['#CD0000', '#003C71', '#00AEEF', '#C4D600', '#F3D54E', '#FFA300', '#555555', '#8CDAFA', '#005A9D'],
       title : {
          text: ''
       },
       credits: {
        enabled: false
      },
       legend: {
        backgroundColor: '#FFFFFF'
      },
       tooltip : {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>Total: {point.y}</br>'
       },
       plotOptions : {
          pie: {
            size: '100%',
             allowPointSelect: true,
             cursor: 'pointer',
             dataLabels: {
                enabled: false
             },
             showInLegend: true
          }
       },
       series : [{
          type: 'pie',
          name: 'Model Type Share',
          data: chartData
       }]
    };
    Highcharts.chart(container, this.chartOptions);
  }
}
