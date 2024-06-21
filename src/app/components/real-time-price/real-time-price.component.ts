import { Component, OnInit } from '@angular/core';
import { MarketDataService } from 'src/app/services/market-data.service';

@Component({
  selector: 'app-real-time-price',
  templateUrl: './real-time-price.component.html',
  styleUrl: './real-time-price.component.scss'
})
export class RealTimePriceComponent implements OnInit {
  realTimeData: any;

  constructor(public marketDataService: MarketDataService) {}

  ngOnInit(): void {
    console.log('123');
    
    this.marketDataService.getRealTimeData().subscribe(data => {
      this.realTimeData = data;
      console.log(this.realTimeData);
      
    });
  }
}
