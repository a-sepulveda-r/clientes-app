// La idea es que en esta clase esten la logica de datos por lo que se
//crean los metodos de crud para luego invocarlos en los componentes

import { DatePipe, formatDate, registerLocaleData } from "@angular/common";
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import Swal from "sweetalert2";
import { AuthService } from "../usuarios/auth.service";
import { Cliente } from "./cliente";
import { Region } from "./region";
// import { CLIENTES } from "./clientes"; para traer clientes localmente

@Injectable()
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
  //lo  reemplaza el token.interceptor
  // private agregarAuthorizationHeader() {
  //   let token = this.authService.token;
  //   if (token != null) {
  //     return this.httpHeaders.append("Authorization", "Bearer " + token);
  //   }
  //   return this.httpHeaders;

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + "/regiones");
  }

  // funcion que retorna el json de los clientes
  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + "/page/" + page).pipe(
      tap((response: any) => {
        console.log("ClienteService: tap 1");
        (response.content as Cliente[]).forEach((cliente) =>
          console.log(cliente.nombre)
        );
      }),
      map((response: any) => {
        (response.content as Cliente[]).map((cliente) => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe = new DatePipe('es');
          //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'es');
          return cliente;
        });
        return response;
      }),
      tap((response) => {
        console.log("ClienteService: tap 2");
        (response.content as Cliente[]).forEach((cliente) =>
          console.log(cliente.nombre)
        );
      })
    );
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEndPoint, cliente).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError((e) => {
        if (e.status == 400) {
          return throwError(() => e);
        }
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }

        console.error(e.error.mensaje);
        return throwError(() => e);
      })
    );
  }

  getCliente(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(["/clientes"]);
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente)
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          if (e.error.mensaje) {
            console.error(e.error.mensaje);
          }
          return throwError(() => e);
        })
      );
  }
  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        if (e.error.mensaje) {
          console.error(e.error.mensaje);
        }
        return throwError(() => e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest(
      "POST",
      `${this.urlEndPoint}/upload`,
      formData,
      {
        reportProgress: true,
      }
    );

    return this.http.request(req);
  }
}
