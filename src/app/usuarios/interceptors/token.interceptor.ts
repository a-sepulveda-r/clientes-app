import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";

import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  // Se inyecta el servicio AuthService que se utiliza para obtener el token de autenticación
  constructor(private authService: AuthService) {}

  // Implementa el método "intercept" del HttpInterceptor para agregar un token de autenticación
  // a las solicitudes salientes
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.authService.token;

    // Verifica si hay un token de autenticación disponible
    if (token != null) {
      // Clona la solicitud original y agrega un encabezado de autorización con el valor
      // "Bearer {token}" utilizando el método "clone" de la clase "HttpRequest"
      const authReq = req.clone({
        headers: req.headers.set("Authorization", "Bearer " + token),
      });

      // Imprime en la consola el valor del token que se está utilizando
      console.log("TokenInterceptor => Bearer " + token);

      // Devuelve la solicitud clonada para que el siguiente interceptor (si lo hay) o el controlador
      // HTTP pueda procesarla
      return next.handle(authReq);
    }

    // Si no se encuentra un token, simplemente devuelve la solicitud original sin modificarla
    return next.handle(req);
  }
}
