import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const API_URL = 'api'; 
const API_WSS_URL = 'wss://platform.fintacharts.com';
const USERNAME = 'r_test@fintatech.com';
const PASSWORD = 'kisfiz-vUnvy9-sopnyv';
const CLIENT_ID = 'app-cli';
const GRANT_TYPE = 'password';
const REALM = 'fintatech';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  private socket$!: WebSocketSubject<any>;
  private realTimeDataSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  private historicalDataSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public token: string = '';
  public activeSymbol: string = 'BTC/USD';
  public symbols: {symbol: string, id: string} [] = [];

  constructor(private http: HttpClient) {
  }

  public authenticate(): Observable<any> {
    const url = `${API_URL}/identity/realms/${REALM}/protocol/openid-connect/token`;
    const body = new HttpParams()
      .set('grant_type', GRANT_TYPE)
      .set('client_id', CLIENT_ID)
      .set('username', USERNAME)
      .set('password', PASSWORD);
    
    return this.http.post(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    })
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
  }

  connect(symbol: string): void {
    
    this.activeSymbol = symbol;
    if (this.socket$) {
      this.socket$.unsubscribe();
    }
    
    let currSymbol: {symbol: string, id: string} | undefined = this.symbols.find(sym => sym.symbol == symbol)

    if (currSymbol) {
      this.socket$ = webSocket({
        url: `${API_WSS_URL}/api/streaming/ws/v1/realtime?token=${this.token}`,
        openObserver: {
          next: () => {
            console.log('WebSocket connected');
            this.sendMessage({
              type: "l1-subscription",
              id: "1",
              instrumentId: currSymbol.id,
              provider: "simulation",
              subscribe: true,
              kinds: ["ask", "bid", "last"]
            });
          }
        },
        closeObserver: {
          next: () => console.log('WebSocket disconnected')
        }
      });

      this.socket$.subscribe(data => {
        this.realTimeDataSubject.next(data)
      });
  }

    
  }

  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  getSymbols(): Observable<{ paging: any, data: any[] }> {
    return this.http.get<{ paging: any, data: any[] }>(`${API_URL}/api/instruments/v1/instruments?provider=oanda&kind=forex`, { headers: this.getHeaders() });
  }

  getRealTimeData(): Observable<any> {
    return this.realTimeDataSubject.asObservable();
  }

  fetchHistoricalData(symbol: string): void {
    
    let currSymbol: {symbol: string, id: string} | undefined = this.symbols.find(sym => sym.symbol == symbol);
    console.log(currSymbol);
    if (currSymbol) {
      const url = `${API_URL}/api/bars/v1/bars/count-back?instrumentId=${currSymbol.id}&provider=oanda&interval=1&periodicity=minute&barsCount=10`;
      this.http.get(url, { headers: this.getHeaders() })
        .subscribe(data =>{ 
          this.historicalDataSubject.next(data)
        });
    }
  }

  getHistoricalData(): Observable<any> {
    return this.historicalDataSubject.asObservable();
  }
}
