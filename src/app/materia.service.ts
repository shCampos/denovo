import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MateriaService{
  URL: string = "https://shaolinbackend.herokuapp.com/api/aulas";
  aulas: any[];
  
  constructor(private http: HttpClient){ this.aulas = []; }


  getAll(){
    var vetor = [];
    this.http.get(this.URL)
    .subscribe((res: {materia}[])=>{
      for(let i=0;i<res.length;i++){
        if(!/PE/.test(res[i].materia)){
          vetor.push(res[i].materia);
        }
      }
    });
    //var a = vetor.filter((el, i, a) => i == a.indexOf(el));

    return vetor;
  }
}
