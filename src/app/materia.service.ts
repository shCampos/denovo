import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MateriaService {
  URL: string = "https://shaolinbackend.herokuapp.com/api/aulas";
  aulas: any[];
  constructor(private http: HttpClient){ this.aulas = []; }

  getAll(){
    this.http.get(this.URL)
    .subscribe((res: {materia}[])=>{
      for(let i=0;i<res.length;i++){
        if(!/PE/.test(res[i].materia)){
          this.aulas.push(res[i].materia);
        }
      }
    });
    return this.aulas;
  }
}
