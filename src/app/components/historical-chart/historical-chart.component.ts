import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/services/market-data.service';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Subscription } from 'rxjs';

Chart.register(...registerables);


@Component({
  selector: 'app-historical-chart',
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss'
})
export class HistoricalChartComponent implements OnInit, OnDestroy {
  historicalTimeData: any;
  public chart: any;
  subscription = new Subscription;

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit(): void {
    this.initializeChart();
    this.subscription.add(this.marketDataService.getHistoricalData().subscribe(data => {
      this.historicalTimeData = data;
      this.updateChart(this.historicalTimeData)
    }));
    
    
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

  updateChart(data: { data:any[] }): void {
    const values = data.data.map(item => item.v);
      const maxValue = Math.max(...values);
      const maxYAxisValue = Math.max(maxValue + 10, 100);

      this.chart.data.labels = [];
      this.chart.data.datasets[0].data = [];
      
    data.data.forEach(item => {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
