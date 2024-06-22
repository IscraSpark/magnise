import { Component, OnInit } from '@angular/core';

import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MarketDataService } from './services/market-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'magnise';

  control = new FormControl('BTC/USD');
  valutes: string[] = ['BTC/USD', 'UAH/USD', 'BTC/UAH', 'BTC/ETH'];
  filteredValutes!: Observable<string[]>;

  constructor(private marketDataService: MarketDataService) {}

  ngOnInit() {
    this.filteredValutes = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    
    this.valutes = this.marketDataService.symbols.map(symbol => symbol.symbol);
    this.marketDataService.connect('BTC/USD');
    // this.marketDataService.fetchHistoricalData('BTC/USD');
  }

  onSubmit(): void {
    
    const symbol = this.control.value;
    console.log(symbol);
    
    if (symbol) {
      this.marketDataService.connect(symbol);
      this.marketDataService.fetchHistoricalData(symbol);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.valutes.filter(street => this._normalizeValue(street).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
