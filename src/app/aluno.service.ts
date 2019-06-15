import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '.././environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlunoService {

  constructor(private http: HttpClient){}

  getByRA(ra){
    return this.http.get(environment.url+"alunos/ra/"+ra);
  }

  getById(id){
    return this.http.get(environment.url+"alunos/id/"+id);
  }

}
