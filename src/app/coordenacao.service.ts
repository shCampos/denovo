import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '.././environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordenacaoService {

  constructor(private http: HttpClient) { }

  getBySetor(setor){
    return this.http.get(environment.url+"coordenacao/"+setor);
  }

}