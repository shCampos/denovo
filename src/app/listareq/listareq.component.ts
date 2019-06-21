import { Component, OnInit, OnDestroy } from '@angular/core';
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
  //requerimentos: Observable<Object[]>;
  requerimentos: any[];
  requerimento: any;
  professor: any;
  aluno: any;
  flagUser: Boolean;
  flagAluno: Boolean;
  status: any[] = ['Deferido', 'Indeferido'];

  constructor(private requerimentoService: RequerimentoService, private modal: NgbModal,
    private alunoService: AlunoService, private professorService: ProfessorService,
    private router: Router, private auth: AuthGuard, private agendamentoService: AgendamentoService) {
    this.requerimentos = [];
  }

  ngOnInit() {
    if(environment.tipo_user == "coord"){
      this.coord_getRequerimentos();
      console.log(this.requerimentos);
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

  // coord_getRequerimentos(){
  //   this.requerimentoService.getAll()
  //   .subscribe(
  //     (res)=>{
  //       this.requerimentos = res;
  //     },
  //     (err)=>{console.log(err);}
  //   )
  // }

  coord_getRequerimentos(){
    this.requerimentoService.getAll()
    .subscribe(
      (res)=>{
        for(let i=0;i<res.length;i++){
          console.log("res[i]", res[i]);
          var req = res[i];
          var id_prof = res[i].id_professor;
          this.alunoService.getById(res[i].id_estudante)
          .subscribe(
            (al)=>{
              //console.log(al.coordenacao, environment.setor, res[i].id_professor);
              if(al.coordenacao == environment.setor){
                this.professorService.getById(res[i].id_professor)
                .subscribe(
                  (prof)=>{
                    this.requerimentos.push({
                      req: res[i],
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
    console.log("environment.id_prof", environment.id);
    this.professorService.getById(Number(environment.id))
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
        for(let i=0;i<res.length;i++){
          if(res[i].id_professor == environment.id && (res[i].status=="Deferido" || res[i].status=="Agendado")){
            this.alunoService.getById(res[i].id_estudante)
            .subscribe(
              (al)=>{
                this.requerimentos.push({
                  req: res[i],
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
    console.log(this.requerimento.req.id, e.value.status);
    this.requerimentoService.setStatus(this.requerimento.req.id, e.value.status);
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

  getAluno(){
    this.alunoService.getById(Number(environment.id))
    .subscribe(
      (res)=>{
        this.aluno = res;
      },
      (err)=>{console.log(err);}
    )
  }

  aluno_getRequerimentos(){
    this.getAluno();
    this.requerimentoService.getByAlunoId(Number(environment.id))
    .subscribe(
      (res)=>{
        for(let i=0;i<res.length;i++){
          console.log("res[i]", res[i]);
          this.professorService.getById(res[i].id_professor)
          .subscribe(
            (prof)=>{
              this.requerimentos.push({
                req: res[i],
                aluno: this.aluno,
                prof: prof
              });
            }
          )
        }
      },
      (err)=>{console.log(err);}
    )
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
