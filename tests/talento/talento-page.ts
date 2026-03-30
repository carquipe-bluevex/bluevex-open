import { expect } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { BasePage } from "../base-page";

export interface TalentFormData {
  nombre: string;
  email: string;
  rol?: string;
  ubicacion?: string;
  linkedin?: string;
  cvPath?: string;
  mensaje?: string;
}

export class TalentoPage extends BasePage {
  readonly nombreInput: Locator;
  readonly emailInput: Locator;
  readonly rolInput: Locator;
  readonly ubicacionInput: Locator;
  readonly linkedinInput: Locator;
  readonly cvInput: Locator;
  readonly mensajeTextarea: Locator;
  readonly privacidadCheckbox: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nombreInput = page.getByLabel("Nombre *");
    this.emailInput = page.getByLabel("Email *");
    this.rolInput = page.getByLabel("Perfil / Rol");
    this.ubicacionInput = page.getByLabel("Ubicación");
    this.linkedinInput = page.getByLabel("LinkedIn o portfolio");
    this.cvInput = page.locator('input[type="file"]');
    this.mensajeTextarea = page.getByLabel("Cuéntanos más");
    this.privacidadCheckbox = page.getByRole("checkbox", {
      name: /política de privacidad/,
    });
    this.submitButton = page.getByRole("button", {
      name: "Enviar candidatura",
    });
  }

  async goto(): Promise<void> {
    await super.goto("/talento");
  }

  async fillForm(data: TalentFormData): Promise<void> {
    await this.nombreInput.fill(data.nombre);
    await this.emailInput.fill(data.email);
    if (data.rol) {
      await this.rolInput.fill(data.rol);
    }
    if (data.ubicacion) {
      await this.ubicacionInput.fill(data.ubicacion);
    }
    if (data.linkedin) {
      await this.linkedinInput.fill(data.linkedin);
    }
    if (data.mensaje) {
      await this.mensajeTextarea.fill(data.mensaje);
    }
  }

  async uploadCV(cvPath: string): Promise<void> {
    await this.cvInput.setInputFiles(cvPath);
  }

  async acceptPrivacy(): Promise<void> {
    await this.privacidadCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async verifySuccessRedirect(): Promise<void> {
    await expect(this.page).toHaveURL("/talento?sent=1");
  }

  async verifyModalVisible(): Promise<void> {
    const modal = this.page.getByRole("heading", {
      name: "Candidatura Enviada",
    });
    await expect(modal).toBeVisible();
  }
}
