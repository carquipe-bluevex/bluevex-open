import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export interface ContactFormData {
  nombre: string;
  empresa?: string;
  email: string;
  tamaño?: string;
  telefono?: string;
  servicio?: string;
  mensaje: string;
}

export class ContactoPage extends BasePage {
  readonly nombreInput: Locator;
  readonly empresaInput: Locator;
  readonly emailInput: Locator;
  readonly tamañoSelect: Locator;
  readonly telefonoInput: Locator;
  readonly servicioSelect: Locator;
  readonly mensajeTextarea: Locator;
  readonly privacidadCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nombreInput = page.getByLabel("Nombre *");
    this.empresaInput = page.getByLabel("Empresa");
    this.emailInput = page.getByLabel("Email *");
    this.tamañoSelect = page.getByLabel("Tamaño de la compañía");
    this.telefonoInput = page.getByLabel("Teléfono");
    this.servicioSelect = page.getByLabel("¿Por dónde quieres empezar?");
    this.mensajeTextarea = page.getByLabel("Cuéntanos más *");
    this.privacidadCheckbox = page.getByRole("checkbox", {
      name: /política de privacidad/,
    });
    this.submitButton = page.getByRole("button", { name: "Enviar mensaje" });
  }

  async goto(): Promise<void> {
    await super.goto("/contacto");
  }

  async fillForm(data: ContactFormData): Promise<void> {
    await this.nombreInput.fill(data.nombre);
    if (data.empresa) {
      await this.empresaInput.fill(data.empresa);
    }
    await this.emailInput.fill(data.email);
    if (data.tamaño) {
      await this.tamañoSelect.selectOption(data.tamaño);
    }
    if (data.telefono) {
      await this.telefonoInput.fill(data.telefono);
    }
    if (data.servicio) {
      await this.servicioSelect.selectOption(data.servicio);
    }
    await this.mensajeTextarea.fill(data.mensaje);
  }

  async acceptPrivacy(): Promise<void> {
    await this.privacidadCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async verifySuccessRedirect(): Promise<void> {
    await expect(this.page).toHaveURL("/contacto?sent=1");
  }

  async verifyModalVisible(): Promise<void> {
    const modal = this.page.getByRole("heading", { name: "Mensaje Enviado" });
    await expect(modal).toBeVisible();
  }
}
