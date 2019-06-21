import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequerimentoService {
  reqs: Observable<any[]>;

  constructor(private http: HttpClient){}

  getAll(): Observable<Object[]>{
    return this.http.get<Object[]>(environment.url+"requerimento");
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

  getByAlunoId(id){
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
