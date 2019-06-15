import { Component, OnInit } from '@angular/core';
import { RequerimentoService } from '../requerimento.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlunoService } from '../aluno.service';
import { environment } from 'src/environments/environment';
import { ProfessorService } from '../professor.service';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AgendamentoService } from '../agendamento.service';

@Component({
  selector: 'app-listareq',
  templateUrl: './listareq.component.html',
  styleUrls: ['./listareq.component.css']
})
export class ListareqComponent implements OnInit {
  requerimentos: any[];
  requerimento: any;
  professor: any;
  flagUser: Boolean;
  status: any[] = ['Encaminhado', 'Deferido', 'Indeferido'];

  constructor(private requerimentoService: RequerimentoService, private modal: NgbModal,
    private alunoService: AlunoService, private professorService: ProfessorService,
    private router: Router, private auth: AuthGuard, private agendamentoService: AgendamentoService) {
    this.requerimentos = [];
  }

  ngOnInit() {
    if(environment.tipo_user == "coord"){
      this.coord_getRequerimentos();
      this.flagUser = false;
    }else if(environment.tipo_user == "prof"){
      this.prof_getRequerimentos();
      this.flagUser = true;
    }
    console.log(this.flagUser);
  }

  coord_getRequerimentos(){
    this.requerimentoService.getAll()
    .subscribe(
      (res)=>{
        for(var i=0;i<res.length;i++){
          console.log("res[i]", res[i].id_professor);
          var req = res[i];
          var id_prof = res[i].id_professor;
          this.alunoService.getById(res[i].id_estudante)
          .subscribe(
            (al)=>{
              //console.log(al.coordenacao, environment.setor, res[i].id_professor);
              if(al.coordenacao == environment.setor){
                this.professorService.getById(id_prof)
                .subscribe(
                  (prof)=>{
                    this.requerimentos.push({
                      req: req,
                      aluno: al,
                      prof: prof
                    });
                  },
                  (err)=>{console.log(err);}
                )
              }
            },
            (err)=>{console.log(err);}
          );
        }
      },
      (err)=>{console.log(err);}
    );
  }

  getProf(){
    console.log("environment.id_prof", environment.id_prof);
    this.professorService.getById(Number(environment.id_prof))
    .subscribe(
      (res)=>{
        this.professor = res;
      },
      (err)=>{console.log(err);}
    );
  }

  prof_getRequerimentos(){
    this.getProf();
    this.requerimentoService.getAll()
    .subscribe(
      (res)=>{
        for(var i=0;i<res.length;i++){
          if(res[i].id_professor == environment.id_prof && res[i].status=="Deferido"){
            var req = res[i];
            console.log("req", req);
            this.alunoService.getById(req.id_estudante)
            .subscribe(
              (al)=>{
                this.requerimentos.push({
                  req: req,
                  aluno: al,
                  prof: this.professor
                });
              },
              (err)=>{console.log(err);}
            )
          }
        }
      },
      (err)=>{console.log(err);}
    );
  }

  mudarStatus(e){
    this.requerimentoService.setStatus(this.requerimento.req.id, e.value.status);
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

  logoff(){
    this.auth.setIsLogged(false);
    this.router.navigate(['']);
  }
}
