import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vaga } from '../models/vaga';
import { VagaEditRequest } from '../models/vaga-edit-request';
import { VagasTotal } from '../models/vagas-total';
import { VagasHash256 } from '../models/vagas-hash-256';
import { VagaCreateRequest } from '../models/vaga-create-request';
import { Filters } from '../models/filters';

@Injectable({
  providedIn: 'root'
})
export class VagasService {

  constructor(private _httpClient: HttpClient) {}
  
  href = 'http://localhost:5000';

  list(filters: Filters): Observable<Vaga[]> {

    let filterUrl = "";
    let count = 0;

    Object.entries(filters).forEach(([chave, valor]) => {
      if(valor) {
        if(count == 0) {
          count++;
          filterUrl = `?${chave}=${valor}`
        } else {
          filterUrl += `&${chave}=${valor}`
        }
      }
    });

    const requestUrl = `/vagas${filterUrl}`;
    return this._httpClient.get<Vaga[]>(this.href + requestUrl);
  }

  edit(vaga: Vaga): Observable<Vaga> {
    const requestUrl = `/vagas/${vaga.id}`;

    const body: VagaEditRequest = { 
      descricao: vaga.descricao, 
      categoria: vaga.categoria, 
      empresa: vaga.empresa,
      tipo: vaga.tipo,
      status: vaga.status
    }

    return this._httpClient.put<Vaga>(this.href + requestUrl, body);
  }

  create(vaga: Vaga): Observable<Vaga> {
    const requestUrl = `/vagas`;

    const body: VagaCreateRequest = { 
      descricao: vaga.descricao, 
      categoria: vaga.categoria, 
      empresa: vaga.empresa,
      tipo: vaga.tipo,
      status: vaga.status
    }

    return this._httpClient.post<Vaga>(this.href + requestUrl, body);
  }

  remove(id: string): Observable<any> {
    const requestUrl = `/vagas/${id}`;
    return this._httpClient.delete(this.href + requestUrl);
  }

  getTotal(): Observable<VagasTotal> {
    const requestUrl = `/vagas/total`;
    return this._httpClient.get<VagasTotal>(this.href + requestUrl);
  }

  downloadZip(): Observable<HttpResponse<Blob>> {
    const requestUrl = `/vagas/zip`;
    return this._httpClient.get(this.href + requestUrl, { responseType: 'blob', observe: 'response' });
  }

  getHash256(): Observable<VagasHash256> {
    const requestUrl = `/vagas/hash`;
    return this._httpClient.get<VagasHash256>(this.href + requestUrl);
  }

}
