import { Component, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/services/market-data.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);


@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss'
})
export class HistoricalChartComponent implements OnInit {
  realTimeData: any;
  public chart: any;
  private newData = [
    { t: '2023-06-20T10:00:00Z', v: 5 },
    { t: '2023-06-20T11:00:00Z', v: 10 },
    { t: '2023-06-20T12:00:00Z', v: 7 },
    { t: '2023-06-20T13:00:00Z', v: 11 },
    { t: '2023-06-20T14:00:00Z', v: 9 }
  ]; // Example new data set

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.marketDataService.getRealTimeData().subscribe(data => {
      this.realTimeData = data;
    });
    this.initializeChart();
    this.updateChart(this.newData)
  }

  initializeChart(): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [], // Timestamps will go here
        datasets: [{
          data: [], // Values will go here
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        plugins: {
          legend: {
            display: false // Hide the legend
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            beginAtZero: true,
            min: 0, // Start value for y-axis
            max: 100, // Initial maximum value for y-axis
            title: {
              display: true,
              text: 'Price'
            }
          }
        }
      }
    });
  }

  updateChart(data: any[]): void {
    const values = data.map(item => item.v);
    const maxValue = Math.max(...values);
    const maxYAxisValue = Math.max(maxValue + 10, 100);

    this.chart.data.labels = [];
    this.chart.data.datasets[0].data = [];

    data.forEach(item => {
      const time = new Date(item.t);
      const value = item.v;
      this.chart.data.labels.push(time);
      this.chart.data.datasets[0].data.push(value);
    });

    // Update the y-axis maximum value
    this.chart.options.scales.y.max = maxYAxisValue;

    // Update the chart
    this.chart.update();
  }

}
