import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isLogged: boolean = false;

  setIsLogged(flag){
    this.isLogged = flag;
  }

  canActivate(): boolean {
    return this.isLogged;
  }
}
