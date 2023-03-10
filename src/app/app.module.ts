import { LOCALE_ID, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { DirectivaComponent } from "./directiva/directiva.component";
import { ClientesComponent } from "./clientes/clientes.component";
import { ClienteService } from "./clientes/cliente.service";
import { Routes, RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { FormComponent } from "./clientes/form.component";
import { FormsModule } from "@angular/forms";
import { registerLocaleData } from "@angular/common";
import localeCL from "@angular/common/locales/es-CL";
registerLocaleData(localeCL, "es-CL");

//Aca configuramos las rutas para que queden asincronas
const routes: Routes = [
  { path: "", redirectTo: "/clientes", pathMatch: "full" },
  { path: "directivas", component: DirectivaComponent },
  { path: "clientes", component: ClientesComponent },
  { path: "clientes/form", component: FormComponent },
  { path: "clientes/form/:id", component: FormComponent },
];

@NgModule({
  //componentæßs
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
  ],
  //services
  providers: [ClienteService, { provide: LOCALE_ID, useValue: "es-CL" }],
  bootstrap: [AppComponent],
})
export class AppModule {}
