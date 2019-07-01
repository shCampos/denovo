import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MateriaService{
  URL: string = "https://shaolinbackend.herokuapp.com/api/materias";
  aulas: any[];
  
  constructor(private http: HttpClient){ this.aulas = []; }


  getAll(){
    var vetor = [];
    this.http.get(this.URL)
    .subscribe((res: {nome}[])=>{
      for(let i=0;i<res.length;i++){
        if(!/PE/.test(res[i].nome)){
          vetor.push(res[i].nome);
        }
      }
    });
    //var a = vetor.filter((el, i, a) => i == a.indexOf(el));

    return vetor;
  }
}
