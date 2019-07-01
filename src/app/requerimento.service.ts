import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, of } from 'rxjs';
import { Requerimento } from './model/Requerimento';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequerimentoService {
  requerimentos: Observable<any[]>;

  constructor(private http: HttpClient){}

  getAllByCoord(coord): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/coord/"+coord);
  }

  getAllByProf(id): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/prof/"+id);
  }

  createReq(req): Observable<any[]>{
    this.http.post<any[]>(environment.url+"requerimento", req)
    return of(req);
  }

  getByHash(hash){
    return this.http.get(environment.url+"requerimento/hash/"+hash);
  }

  getAllByAlunoId(id): Observable<any[]>{
    return this.http.get<any[]>(environment.url+"requerimento/est/"+id);
  }

  setStatus(id, status){
    console.log(id, status);
    this.http.put(environment.url+"/requerimento/"+id, status)
    .subscribe(
      (res)=>{console.log("setStatus put works!");},
      (err)=>{console.log("setStatus doesnt work!", err);}
    );
  }
}
