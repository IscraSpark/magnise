import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const API_URL = 'https://platform.fintacharts.com'; 
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
  private token: string = '';
  public activeSymbol: string = 'BTC/USD';
  public symbols: {symbol: string, id: string} [] = [];

  constructor(private http: HttpClient) {
    // this.authenticate();
    this.token = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJTUDJFWmlsdm8zS2g3aGEtSFRVU0I3bmZ6dERRN21tb3M3TXZndlI5UnZjIn0.eyJleHAiOjE3MTg5NzUyNTMsImlhdCI6MTcxODk3MzQ1MywianRpIjoiMmZmOTQ1ZjAtMGJmMy00MmVlLThlMGYtM2VhZTRiYzk1YjQwIiwiaXNzIjoiaHR0cHM6Ly9wbGF0Zm9ybS5maW50YWNoYXJ0cy5jb20vaWRlbnRpdHkvcmVhbG1zL2ZpbnRhdGVjaCIsImF1ZCI6WyJuZXdzLWNvbnNvbGlkYXRvciIsImJhcnMtY29uc29saWRhdG9yIiwidHJhZGluZy1jb25zb2xpZGF0b3IiLCJjb3B5LXRyYWRlci1jb25zb2xpZGF0b3IiLCJwYXltZW50cyIsIndlYi1zb2NrZXRzLXN0cmVhbWluZyIsInVzZXItZGF0YS1zdG9yZSIsImFsZXJ0cy1jb25zb2xpZGF0b3IiLCJ1c2VyLXByb2ZpbGUiLCJlbWFpbC1ub3RpZmljYXRpb25zIiwiaW5zdHJ1bWVudHMtY29uc29saWRhdG9yIiwiYWNjb3VudCJdLCJzdWIiOiI5NWU2NmRiYi00N2E3LTQ4ZDktOWRmZS00ZWM2Y2U0MWNiNDEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJhcHAtY2xpIiwic2Vzc2lvbl9zdGF0ZSI6IjllOTg2N2QyLWVjZWItNDdiNy04YzcyLWQzMzcyNTNlZjIzZSIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6ImVtYWlsIHByb2ZpbGUiLCJzaWQiOiI5ZTk4NjdkMi1lY2ViLTQ3YjctOGM3Mi1kMzM3MjUzZWYyM2UiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJkZWZhdWx0LXJvbGVzLWZpbnRhdGVjaCIsInVtYV9hdXRob3JpemF0aW9uIiwidXNlcnMiXSwibmFtZSI6IkRlbW8gVXNlciIsInByZWZlcnJlZF91c2VybmFtZSI6InJfdGVzdEBmaW50YXRlY2guY29tIiwiZ2l2ZW5fbmFtZSI6IkRlbW8iLCJmYW1pbHlfbmFtZSI6IlVzZXIiLCJlbWFpbCI6InJfdGVzdEBmaW50YXRlY2guY29tIn0.y7kJKuRJSmUc9Lw45CCUQAL7ugDPSEnSuD3Z97AYhiAo3j_-YaVCImtbluibfcZGicwcMCcSyHxkInqO_GswAXO7KiVJU_SixCS2Ux2ruMOhJc5fynfnElIxnCo08HYFIGdNYaXj7wdjZM-pJmdXzWK5lTQLf-W7NF7nrNP001Dfs6zd8fzext7KT96Ijq7AGdPFDQ6qEvA9LyND-sfXps5zG0Bz0SdwPJlcBdDuyLkbrC7D4CLY41zwE-ST9s2zYqnspXNgw_x0mpWhazGHJYNXNqzwsbBfJS6_zkDDk7MZbFgzNZ4IXuDSEXPklhrtn4ocl2Bgnu_AqiI9GhDZiw'
    this.getSymbols();
  }

  private authenticate(): void {
    console.log('1');
    
    const url = `http://localhost:3000/api/identity/realms/${REALM}/protocol/openid-connect/token`;
    const body = new HttpParams()
      .set('grant_type', GRANT_TYPE)
      .set('client_id', CLIENT_ID)
      .set('username', USERNAME)
      .set('password', PASSWORD);
    console.log('2');
    
    this.http.post(url, body.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
    }).subscribe((response: any) => {
      this.token = response.access_token;
      console.log(this.token);
      
    }, (error) => {
      console.error('Authentication error:', error);
    });
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

    let currSymbol: {symbol: string, id: string} | undefined = this.symbols.find(sym => sym.id == symbol)

    if (currSymbol) {
      this.socket$ = webSocket({
        url: `wss://platform.fintacharts.com/api/streaming/ws/v1/realtime?token=${this.token}`,
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
  }

    this.socket$.subscribe(data => {
      this.realTimeDataSubject.next(data)
      console.log(data);
    });
  }

  sendMessage(message: any): void {
    if (this.socket$) {
      this.socket$.next(message);
    } else {
      console.error('WebSocket connection is not established.');
    }
  }

  getSymbols(): void {
    this.http.get<{ paging: any, data: any[] }>(`${API_URL}/api/instruments/v1/instruments?provider=oanda&kind=forex`, { headers: this.getHeaders() }).subscribe(
      (data) => {
        this.symbols = data.data.map(symbol => {
          return { symbol: symbol.symbol, id: symbol.id };
        });
        console.log(this.symbols);
      },
      (error) => {
        console.error('Error fetching symbols:', error);
      }
    );

  }

  getRealTimeData(): Observable<any> {
    return this.realTimeDataSubject.asObservable();
  }

  fetchHistoricalData(symbol: string): void {
    const url = `${API_URL}/api/bars/v1/bars/count-back?instrumentId=${symbol}&provider=oanda&interval=1&periodicity=minute&barsCount=10`;
    this.http.get(url, { headers: this.getHeaders() })
      .subscribe(data => this.historicalDataSubject.next(data));
  }

  getHistoricalData(): Observable<any> {
    return this.historicalDataSubject.asObservable();
  }
}
