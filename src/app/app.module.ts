import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HistoricalChartComponent } from './components/historical-chart/historical-chart.component';
import { RealTimePriceComponent } from './components/real-time-price/real-time-price.component';
import { MarketDataService } from './services/market-data.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    HistoricalChartComponent,
    RealTimePriceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    
  ],
  providers: [MarketDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
