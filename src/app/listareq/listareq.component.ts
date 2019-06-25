import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequerimentoService } from '../requerimento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlunoService } from '../aluno.service';
import { environment } from 'src/environments/environment';
import { ProfessorService } from '../professor.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AgendamentoService } from '../agendamento.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listareq',
  templateUrl: './listareq.component.html',
  styleUrls: ['./listareq.component.css']
})
export class ListareqComponent implements OnInit {
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
      this.flagAluno = true;
    }
    console.log(this.flagUser);
  }

  coord_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getAllByCoord(environment.setor);
    console.log("this.requerimentos", this.requerimentos);
  }

  prof_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getAllByProf(environment.id);
  }

  mudarStatus(e){
    console.log(this.requerimento[0].id, e.value.status);
    this.requerimentoService.setStatus(this.requerimento[0].id, e.value.status);
    //pegar o requerimento na res da requisição e atualiar no this.requerimentos
    this.modal.dismissAll();
    this.router.navigate(['lista']);
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

  aluno_getRequerimentos(){
    this.requerimentos = this.requerimentoService.getByAlunoId(environment.id);
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
