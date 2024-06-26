import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MarketDataService } from 'src/app/services/market-data.service';

@Component({
  selector: 'app-real-time-price',
  templateUrl: './real-time-price.component.html',
  styleUrl: './real-time-price.component.scss'
})
export class RealTimePriceComponent implements OnInit, OnDestroy {
  realTimeData: any;
  subscription = new Subscription;
  prevPrise: any = '???'
  prevTime: any = '???'

  constructor(public marketDataService: MarketDataService) {}

  ngOnInit(): void {
    
    this.subscription.add(this.marketDataService.getRealTimeData().subscribe(data => {
      if (this.realTimeData?.ask?.timestamp && this.realTimeData?.ask?.price) {
        this.prevPrise = this.realTimeData?.ask?.price;
        this.prevTime = this.realTimeData?.ask?.timestamp; 
      }
      this.realTimeData = data;
      
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
