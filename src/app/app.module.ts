import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ListareqComponent } from './listareq/listareq.component';
import { ModalConfirmacao } from './home/home.component';
import { AuthGuard } from './auth.guard';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'lista', component: ListareqComponent, canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ListareqComponent,
    ModalConfirmacao
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalConfirmacao]
})
export class AppModule { }
