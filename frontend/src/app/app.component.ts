import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Component, AfterViewInit, inject, LOCALE_ID} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DatePipe, registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);

@Component({
  selector: 'app-root',
  imports: [MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, DatePipe, HttpClientModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  private _httpClient = inject(HttpClient);

  displayedColumns: string[] = ["id", "tipo", "categoria", "empresa", "status", "data_criacao", "descricao"];
  vagasAPI: VagasHttpDatabase = {} as VagasHttpDatabase;
  data: Vaga[] = [];

  resultsLength = 0;
  isLoadingResults = true;

  ngAfterViewInit() {
    this.vagasAPI = new VagasHttpDatabase(this._httpClient);

    merge()
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.vagasAPI!.list().pipe(catchError(() => observableOf(null)));
        }),
        map(data => {
          this.isLoadingResults = false;

          if (data === null) {
            return [];
          }

          this.resultsLength = data.length;
          return data;
        }),
      )
      .subscribe(data => (this.data = data));
  }
}

export interface Vaga {
  id: string;
  descricao: string;
  status: string;
  data_criacao: string;
  tipo: string;
  categoria: string;
}

export class VagasHttpDatabase {
  constructor(private _httpClient: HttpClient) {}
  href = 'http://localhost:5000';

  list(): Observable<Vaga[]> {
    const requestUrl = `/vagas`;

    return this._httpClient.get<Vaga[]>(this.href + requestUrl);
  }
}
