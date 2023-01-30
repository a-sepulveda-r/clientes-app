import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Cliente } from "./cliente";
import { ClienteService } from "./cliente.service";

@Component({
  selector: "app-form",
  templateUrl: "./form.component.html",
})
export class FormComponent implements OnInit {
  titulo: string = "Formulario";
  cliente: Cliente = new Cliente();

  constructor(
    private clienteService: ClienteService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    //esto hace iniciar el componente apenas se carga
    this.cargarCliente();
  }

  public cargarCliente(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params["id"];
      if (id) {
        this.clienteService
          .getCliente(id)
          .subscribe((cliente) => (this.cliente = cliente));
      }
    });
  }
  // para transformar una respuesta del servidor se utiliza el operador map,
  // esto para no usar el any aunque ambos metodos sirven
  public create(): void {
    this.clienteService.create(this.cliente).subscribe((cliente) => {
      this.router.navigate(["/clientes"]);
      Swal.fire(
        "Nuevo cliente",
        `El cliente ${cliente.nombre} ha sido creado con éxito`,
        "success"
      );
    });
  }

  public update(): void {
    this.clienteService.update(this.cliente).subscribe((json) => {
      this.router.navigate(["/clientes"]);
      Swal.fire(
        "Cliente Actualizado",
        `${json.mensaje}: ${json.cliente.nombre}`,
        "success"
      );
    });
  }
}
