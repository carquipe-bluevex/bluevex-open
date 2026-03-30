import { test, expect } from "@playwright/test";
import { ContactoPage } from "./contacto-page";

test.describe("Contacto Form", () => {
  test(
    "User can submit contact form successfully",
    { tag: ["@critical", "@e2e", "@contacto"] },
    async ({ page }) => {
      const contactoPage = new ContactoPage(page);

      await contactoPage.goto();

      // Fill the form
      await contactoPage.fillForm({
        nombre: "Carlos Quinza",
        empresa: "BlueVex",
        email: "carlos@example.com",
        tamaño: "11-50",
        telefono: "+34 600 000 000",
        servicio: "soporte",
        mensaje: "Necesitamos ayuda con nuestra infraestructura.",
      });

      // Accept privacy policy
      await contactoPage.acceptPrivacy();

      // Submit the form
      await contactoPage.submit();

      // Verify successful redirect
      await contactoPage.verifySuccessRedirect();

      // Verify modal appears
      await contactoPage.verifyModalVisible();
    },
  );

  test(
    "Contact form validation - required fields",
    { tag: ["@high", "@e2e", "@contacto"] },
    async ({ page }) => {
      const contactoPage = new ContactoPage(page);

      await contactoPage.goto();

      // Try to submit without filling required fields
      await contactoPage.submitButton.click();

      // Form should not submit (HTML5 validation)
      const isValid = await page.evaluate(() => {
        const form = document.querySelector(
          'form[action="/api/contacto"]',
        ) as HTMLFormElement;
        return form ? form.checkValidity() : false;
      });

      expect(isValid).toBeFalsy();
    },
  );

  test(
    "Contact form with minimal data",
    { tag: ["@high", "@e2e", "@contacto"] },
    async ({ page }) => {
      const contactoPage = new ContactoPage(page);

      await contactoPage.goto();

      // Fill only required fields
      await contactoPage.fillForm({
        nombre: "Test User",
        email: "test@example.com",
        mensaje: "Just a test message.",
      });

      await contactoPage.acceptPrivacy();
      await contactoPage.submit();

      // Should redirect successfully
      await contactoPage.verifySuccessRedirect();
    },
  );
});
