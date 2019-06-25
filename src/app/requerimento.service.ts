import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map, materialize } from 'rxjs/operators';
import { Requerimento } from './model/Requerimento';

@Injectable({
  providedIn: 'root'
})
export class RequerimentoService {
  constructor(private http: HttpClient){}

  getAllByCoord(coord): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/coord/"+coord);
  }

  getAllByProf(id): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/prof/"+id);
  }

  createReq(req){
    this.http.post(environment.url+"requerimento", req)
    .subscribe(
      (res)=>{
        console.log("funcionou");
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  getByHash(hash){
    return this.http.get(environment.url+"requerimento/hash/"+hash);
  }

  getAllByAlunoId(id): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/est/"+id);
  }

  setStatus(id, status){
    this.http.put(environment.url+"/requerimento/"+id, status)
    .subscribe(
      (res)=>{
        console.log("funcionou");
      },
      (err)=>{
        console.log(err);
      }
    );
  }
}
