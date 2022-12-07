import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { Auth } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _auth: Auth | undefined;

  get auth() {
    return { ...this._auth! }
  }

  constructor(private http: HttpClient) { }

  verificaAutenticacion(): Observable<boolean> {
    if (!localStorage.getItem('token')) { // si NO existe el usuario
      return of(false); // respondo con false, para indicar que el usuario no está autentificado
    }

    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        map(auth => { // recibiremos el objeto auth, y para utilizaremos el map, para transformar lo que recibe por un nuevo valor, para transformar cosas
          this._auth = auth
          return true;
        })
      )
  }

  login() {
    return this.http.get<Auth>(`${this.baseUrl}/usuarios/1`)
      .pipe(
        tap(auth => this._auth = auth),
        tap(auth => localStorage.setItem('token', auth.id))
      );
  }

  logout() {
    this._auth = undefined;
  }
}
