import { Component } from "@angular/core";
import Swal from "sweetalert2";
import { Usuario } from "./usuario";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  titulo: string = "Por favor Sign in";
  usuario: Usuario;

  constructor() {
    this.usuario = new Usuario();
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire("Error login", "Username or password vacías", "error");
      return;
    }
  }
}
