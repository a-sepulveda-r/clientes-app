// La idea es que en esta clase esten la logica de datos por lo que se
//crean los metodos de crud para luego invocarlos en los componentes

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, map, Observable, throwError } from "rxjs";
import Swal from "sweetalert2";
import { Cliente } from "./cliente";
// import { CLIENTES } from "./clientes"; para traer clientes localmente

@Injectable()
export class ClienteService {
  private urlEndPoint: string = "http://localhost:8080/api/clientes";
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });
  constructor(private http: HttpClient, private router: Router) {}

  // funcion que retorna el json de los clientes
  getClientes(): Observable<Cliente[]> {
    return this.http
      .get(this.urlEndPoint)
      .pipe(map((response) => response as Cliente[]));
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http
      .post(this.urlEndPoint, cliente, {
        headers: this.httpHeaders,
      })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
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
