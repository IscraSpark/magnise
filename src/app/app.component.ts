import { Component, OnDestroy, OnInit } from '@angular/core';

import {FormControl } from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import { MarketDataService } from './services/market-data.service';

const startValue = 'EUR/USD'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'magnise';
  control = new FormControl(startValue);
  valutes: string[] = ['BTC/USD', 'UAH/USD', 'BTC/UAH', 'BTC/ETH'];
  symbols: {symbol: string, id: string} [] = [];
  filteredValutes!: Observable<string[]>;
  subscriptions = new Subscription();

  constructor(private marketDataService: MarketDataService) {
  }

  ngOnInit() {
    this.init();

  }

  init() {
    this.subscriptions.add(this.marketDataService.authenticate().subscribe((response: any) => {
      this.marketDataService.token = response.access_token;
      this.subscriptions.add(this.marketDataService.getSymbols().subscribe(
        (data) => {
          
          this.symbols = data.data.map(symbol => {
            return { symbol: symbol.symbol, id: symbol.id };
          });
          this.marketDataService.symbols = this.symbols;
          this.valutes = this.marketDataService.symbols.map(symbol => symbol.symbol);
          this.marketDataService.connect(startValue);
          this.marketDataService.fetchHistoricalData(startValue);
          this.filteredValutes = this.control.valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value || '')),
          );
        },
        (error) => {
          console.error('Error fetching symbols:', error);
        }));
      
      
    }, (error) => {
      console.error('Authentication error:', error);
    }));
  }

    
    

  onSubmit(): void {
    const symbol = this.control.value;
    
    if (symbol) {
      this.marketDataService.connect(symbol);
      this.marketDataService.fetchHistoricalData(symbol);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.valutes.filter(valute => this._normalizeValue(valute).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
}
