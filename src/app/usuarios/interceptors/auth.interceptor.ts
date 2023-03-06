import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { catchError, Observable, throwError } from "rxjs";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

/**
 * Este interceptor se encarga de manejar los errores de autenticación y autorización de las peticiones HTTP.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //Se envía la petición al siguiente interceptor en la cadena
    return next.handle(req).pipe(
      //Se captura y maneja cualquier error que se produzca
      catchError((e) => {
        //En caso de error 401 (No Autorizado)
        if (e.status == 401) {
          //Se verifica si el usuario está autenticado
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          //Si no lo está, se redirige al login
          this.router.navigate(["/login"]);
        }
        //En caso de error 403 (Prohibido)
        if (e.status == 403) {
          //Se muestra un mensaje de alerta con la información del usuario y se redirige a la página de clientes
          Swal.fire(
            "Acceso Denegado",
            `Hola ${this.authService.usuario.username} no tienes acceso a este recurso`,
            "warning"
          );
          this.router.navigate(["/clientes"]);
        }
        //Se propaga el error para que sea manejado por el componente que hizo la petición
        return throwError(() => e);
      })
    );
  }
}
