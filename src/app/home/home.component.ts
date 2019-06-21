import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RequerimentoService } from '../requerimento.service';
import { AlunoService } from '../aluno.service';
import { ProfessorService } from '../professor.service';
import { CoordenacaoService } from '../coordenacao.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AgendamentoService } from '../agendamento.service';
import { NgbActiveModal, NgbModal, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { isNullOrUndefined } from 'util';
import { Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'modal-confirmacao',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">{{situacao}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <h4>{{mensagem}}</h4>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="modal.dismss('Save click')">Ok</button>
  </div>
  `,
  exportAs: "ModalConfirmacao"
})
export class ModalConfirmacao {
  @Input() situacao = "";
  @Input() mensagem = "";

  constructor(public activeModal: NgbActiveModal){}
}

@Component({
  selector: 'modal-consulta',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">REQUERIMENTO - {{hash}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="modal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <h3>{{mensagem}}</h3>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="modal.dismiss('Save click')">Ok</button>
  </div>
  `,
  exportAs: "ModalConsulta"
})
export class ModalConsulta{
  @Input() hash = "";
  @Input() mensagem = "";

  constructor(public activeModal: NgbActiveModal){}
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  entryComponents: [ModalConfirmacao, ModalConsulta],
})
export class HomeComponent implements OnInit {
  flagSenha: Boolean;
  flagOutraJust: Boolean;
  flagRa: Boolean;
  setores: any[] = ['COINF', 'COCIP', 'COTAD', 'COMET'];
  formFlag: Boolean;
  hash: any;
  professores: any[];
  flagAg: Boolean;

  confirmModal: any;
  consultaModal: any;  

  //@ViewChild('instance') instance: NgbTypeahead;
  formatter = (x: {nome: string}) => x.nome;

  constructor(private requerimentoService: RequerimentoService, private alunoService: AlunoService,
    private professorService: ProfessorService, private modal: NgbModal, private coordenacaoService: CoordenacaoService,
    private router: Router, private auth: AuthGuard, private agendamentoService: AgendamentoService){
      this.professores = [];
    }

  ngOnInit() {
    this.getAllProfs();
  }

  getAllProfs(){
    this.professorService.getAll()
    .subscribe(
      (res)=>{
        for(var i=0;i<res.length;i++){
          this.professores.push(res[i]);
        }
      }
    );
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term === '' ? this.professores
        : this.professores.filter(v => v.nome.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    )
  

  novoRequerimento(e){
    console.log(e.value);
    var id;
    this.alunoService.getByRA(e.value.ra).subscribe(
      (res)=>{
        if(isNullOrUndefined(res)){
          this.flagRa = true;
        }else{
          this.formFlag = false;
          console.log("res", res, res.id);
          id = res.id;
          this.hash = this.criarHash();
          console.log("id", id);
          this.requerimentoService.createReq({
            id_estudante: id,
            id_professor: e.value.professor,
            justificativa: e.value.justificativa,
            materia: e.value.materia,
            status: "Encaminhado",
            hash: this.hash
          })        
          this.confirmModal = this.modal.open(ModalConfirmacao);
          this.confirmModal.componentInstance.situacao = 'Requerimento realizado';
          this.confirmModal.componentInstance.mensagem = "O requerimento foi realizado com sucesso. Para consulta, use o código "+this.hash+".";  
        }
      },
      (err) => {
        console.log("aoishashioa");
        console.log(err);
      }
    );
  }

  pesquisarRequerimento(e){
    let validateStr = (stringToValidate) => {
      var pattern = /[a-zA-Z]+[(@!#\$%\^\&*\)\(+=._-]{1,}/;
      if ( stringToValidate && stringToValidate.length > 2 && pattern.test(stringToValidate)) {
        return true;
      } else {
        return false;
      }
    };

    if(validateStr){
      this.alunoService.getByRA(e.value.coisa)
      .subscribe(
        (res)=>{
          environment.tipo_user = "visitante";
          environment.id = res.id;
          this.auth.setIsLogged(true);
          this.router.navigate(['lista']);
        },
        (err)=>{console.log(err);}
      );
    }else{
      this.requerimentoService.getByHash(e.value.coisa)
      .subscribe(
        (res)=>{
          if(res.status == "Agendado"){
            this.flagAg = true;
            this.agendamentoService.getByReqId(res.id)
            .subscribe(
              (ag)=>{
                this.consultaModal.componentInstance.mensagem = "O status atual é " + res.status +". A data da nova avaliação é "+ag.data;
              },
              (err)=>{console.log(err);}
            );
          }else{         
            this.consultaModal = this.modal.open(ModalConsulta);
            this.consultaModal.componentInstance.hash = this.hash;
            this.consultaModal.componentInstance.mensagem = "O status atual é " + res.status +".";
          }
        },
        (err)=>{
          console.log(err);
        }
      );
    }
  }

  criarHash(){
    var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    var tamChave = 10;
    let text = "";
    for (let i = 0; i < tamChave; i++) {
      text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return text;
  }

  openModal(content){
    this.modal.open(content);
  }

  loginCoord(e){
    this.flagSenha = false;
    this.coordenacaoService.getBySetor(e.value.setor)
    .subscribe(
      (res)=>{
        if(e.value.senha == res.senha){
          environment.tipo_user = "coord";
          environment.setor = e.value.setor;
          this.auth.setIsLogged(true);
          this.router.navigate(['lista']);
          this.modal.dismissAll();
        }else{
          this.flagSenha = true;
        }
      },
      (err)=>{
        console.log(err);
      }
    );
  }

  loginProf(e){
    this.flagSenha = false;
    this.professorService.getByEmail(e.value.email)
    .subscribe(
      (res)=>{
        console.log("res", res);
        if(e.value.senha == res.senha){
          console.log("prof", e.value);
          this.auth.setIsLogged(true);
          environment.tipo_user = "prof";
          environment.id = res.id;
          this.modal.dismissAll();
          this.router.navigate(['lista']);
        }else{
          this.flagSenha = true;
        }
      }
    );
  }
}
