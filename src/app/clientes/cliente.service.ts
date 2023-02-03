// La idea es que en esta clase esten la logica de datos por lo que se
//crean los metodos de crud para luego invocarlos en los componentes

import { DatePipe, formatDate, registerLocaleData } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, tap, throwError } from "rxjs";
import Swal from "sweetalert2";
import { Cliente } from "./cliente";
// import { CLIENTES } from "./clientes"; para traer clientes localmente

@Injectable()
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private http: HttpClient, private router: Router) {}

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
    return this.http
      .post(this.urlEndPoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(() => e);
        })
      );
  }

  getCliente(id: any): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((e) => {
        this.router.navigate(["/clientes"]);
        console.error(e.error.mensaje);
        Swal.fire("Error al editar", e.error.mensaje, "error");
        return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http
      .put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }

          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(() => e);
        })
      );
  }
  delete(id: number): Observable<Cliente> {
    return this.http
      .delete<Cliente>(`${this.urlEndPoint}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          console.error(e.error.mensaje);
          Swal.fire(e.error.mensaje, e.error.error, "error");
          return throwError(() => e);
        })
      );
  }
}
