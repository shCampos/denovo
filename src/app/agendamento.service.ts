import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '.././environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {

  constructor(private http: HttpClient) { }

  getByReqId(id){
    return this.http.get(environment.url+"agendamento/req/"+id);
  }

  createAg(ag){
    this.http.post(environment.url+"agendamento", ag)
    .subscribe(
      (res)=>{
        console.log("criou agendamento");
      },
      (err)=>{
        console.log(err);
      }
    );
  }
}
