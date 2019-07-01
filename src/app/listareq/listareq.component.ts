import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequerimentoService } from '../requerimento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlunoService } from '../aluno.service';
import { environment } from 'src/environments/environment';
import { ProfessorService } from '../professor.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AgendamentoService } from '../agendamento.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-listareq',
  templateUrl: './listareq.component.html',
  styleUrls: ['./listareq.component.css']
})
export class ListareqComponent implements OnInit {
  //requerimentos: Subject<Observable<any[]>[]> = new BehaviorSubject<Observable<any[]>[]>([]);
  requerimentos: Observable<any[]>;
  //requerimentos: any[];
  requerimento: any;
  professor: any;
  aluno: any;
  flagUser: Boolean;
  flagAluno: Boolean;
  status: any[] = ['Deferido', 'Indeferido'];

  constructor(private requerimentoService: RequerimentoService, private modal: NgbModal,
    private alunoService: AlunoService, private professorService: ProfessorService,
    private router: Router, private auth: AuthGuard, private agendamentoService: AgendamentoService) {
    //this.requerimentos = {};
  }

  ngOnInit() {
    if(environment.tipo_user == "coord"){
      this.coord_getRequerimentos();
      this.flagUser = false;
    }else if(environment.tipo_user == "prof"){
      this.prof_getRequerimentos();
      this.flagUser = true;
    }else if(environment.tipo_user == "visitante"){
      this.aluno_getRequerimentos();
      this.flagUser = false;
      this.flagAluno = true;
    }
    console.log(this.flagUser);
  }


  coord_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getAllByCoord(environment.id);
  }

  prof_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getAllByProf(environment.id);
  }

  aluno_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getAllByAlunoId(environment.id);
  }

  mudarStatus(e){
    console.log(this.requerimento[0].id, e.value.status);
    var status = e.value.status;
    this.requerimentoService.setStatus(this.requerimento[0].id, e.value.status);
    this.requerimentos.subscribe(
      (res)=>{
        console.log("res", res);
        this.coord_getRequerimentos();
        // res.forEach(r => {
        //   console.log("ta no forEach", r);
        //   if(r[0].id == this.requerimento[0].id){
        //     console.log("entrou no if");
        //     console.log("status", status);
        //     console.log("antes r[0]", r[0]);
        //     r[0].status = status;
        //     console.log("r[0]", r[0], status);
        //   }
        // });
      },
      (err)=>{console.log(err);}
    );
    this.modal.dismissAll();
    //this.requerimentos = this.requerimentoService.requerimentos;
  }

  mudarReq(r){
    this.requerimento = r;
  }

  openModal(content){
    this.modal.open(content);
  }

  agendarReq(e){
    this.agendamentoService.createAg({
      id_prof: this.requerimento.prof.id,
      id_req: this.requerimento.req.id,
      id_estudante: this.requerimento.aluno.id,
      data: e.value.data.day+"/"+e.value.data.month+"/"+e.value.data.year
    });
    this.requerimentoService.setStatus(this.requerimento.req.id, "Agendado");
    this.modal.dismissAll();
  }

  logoff(){
    this.auth.setIsLogged(false);
    this.router.navigate(['']);
  }

  ngOnDestroy(){
    this.auth.setIsLogged(false);
    this.router.navigate(['']);
  }
}
