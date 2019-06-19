import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequerimentoService {
  reqs: Observable<any>;

  constructor(private http: HttpClient){}

  getAll(){
    this.reqs = this.http.get(environment.url+"requerimento");
    return this.reqs;
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
    this.reqs = this.http.get(environment.url+"requerimento/hash/"+hash);
    return this.reqs;
  }

  getByAlunoId(id){
    return this.http.get(environment.url+"requerimento/est/"+id);
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
