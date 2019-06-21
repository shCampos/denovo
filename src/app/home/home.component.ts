import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { RequerimentoService } from '../requerimento.service';
import { AlunoService } from '../aluno.service';
import { ProfessorService } from '../professor.service';
import { CoordenacaoService } from '../coordenacao.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthGuard } from '../auth.guard';
import { AgendamentoService } from '../agendamento.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MateriaService } from '../materia.service';

@Component({
  selector: 'modal-confirmacao',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">{{situacao}}</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <h4>{{mensagem}}</h4>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Save click')">Ok</button>
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
    <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <h3>{{mensagem}}</h3>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Save click')">Ok</button>
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
  materias: any[];
  flagAg: Boolean;

  confirmModal: any;
  consultaModal: any;

  formatter = (x: {nome: string}) => x.nome;

  constructor(private requerimentoService: RequerimentoService, private alunoService: AlunoService,
    private professorService: ProfessorService, private modal: NgbModal, private coordenacaoService: CoordenacaoService,
    private router: Router, private auth: AuthGuard, private agendamentoService: AgendamentoService,
    private materiaService: MateriaService){
      this.professores = [];
      this.materias = [];
    }

  ngOnInit() {
    this.getAllProfs();
    this.getAllMaterias();
  }

  getAllMaterias(){
    this.materias = this.materiaService.getAll();
  }

  getAllProfs(){
    this.professorService.getAll()
    .subscribe(
      (res: any[])=>{
        console.log(res);
        for(var i=0;i<res.length;i++){
          this.professores.push(res[i]);
        }
      }
    );
  }

  searchProf = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => (term === '' ? this.professores
        : this.professores.filter(v => v.nome.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    )
  
  searchMaterias = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.materias.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  novoRequerimento(e){
    console.log(e.value);
    var id;
    this.alunoService.getByRA(e.value.ra).subscribe(
      (res: {id})=>{
        if(isNullOrUndefined(res)){
          this.flagRa = true;
        }else{
          this.formFlag = false;
          this.hash = this.criarHash();
          this.requerimentoService.createReq({
            id_estudante: res.id,
            turma_estudante: e.value.turma,
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
      (err) => {console.log(err);}
    );
  }

  pesquisarRequerimento(e){
    if(/REQ/.test(e.value.coisa) || /req/.test(e.value.coisa) || /Req/.test(e.value.coisa)){
      this.requerimentoService.getByHash(e.value.coisa)
      .subscribe(
        (res: {status, id, hash})=>{
          if(isNullOrUndefined(res)){
            this.confirmModal = this.modal.open(ModalConfirmacao);
            this.confirmModal.componentInstance.situacao = 'Código não achado';
            this.confirmModal.componentInstance.mensagem = "O código não foi encontrado. Confira se digitou certo.";    
          }else if(res.status == "Agendado"){
            this.flagAg = true;
            this.agendamentoService.getByReqId(res.id)
            .subscribe(
              (ag: {data})=>{
                this.consultaModal.componentInstance.mensagem = "O status atual é " + res.status +". A data da nova avaliação é "+ag.data;
              },
              (err)=>{console.log(err);}
            );
          }else{         
            this.consultaModal = this.modal.open(ModalConsulta);
            this.consultaModal.componentInstance.hash = res.hash;
            this.consultaModal.componentInstance.mensagem = "O status atual é " + res.status +".";
          }
        },
        (err)=>{
          console.log(err);
        }
      );
    }else{
      this.alunoService.getByRA(e.value.coisa)
      .subscribe(
        (res: {id})=>{
          environment.tipo_user = "visitante";
          environment.id = res.id;
          this.auth.setIsLogged(true);
          this.router.navigate(['lista']);
        },
        (err)=>{console.log(err);}
      );
    }
  }

  criarHash(){
    var caracteres = "1234567890";
    var tamChave = 4;
    let text = "REQ";
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
      (res: {senha})=>{
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
      (res: {senha, id})=>{
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
