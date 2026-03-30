import { test, expect } from "@playwright/test";
import { TalentoPage } from "./talento-page";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test.describe("Talento Form", () => {
  test(
    "User can submit talent form with CV successfully",
    { tag: ["@critical", "@e2e", "@talento"] },
    async ({ page }) => {
      const talentoPage = new TalentoPage(page);
      const cvPath = path.resolve(__dirname, "../fixtures/test-cv.pdf");

      await talentoPage.goto();

      // Fill the form
      await talentoPage.fillForm({
        nombre: "Senior Engineer",
        email: "senior@example.com",
        rol: "Ingeniero/a de Sistemas",
        ubicacion: "Valencia, España",
        linkedin: "https://linkedin.com/in/seniorengineer",
        mensaje: "Interested in working with BlueVex on interesting projects.",
      });

      // Upload CV
      await talentoPage.uploadCV(cvPath);

      // Accept privacy policy
      await talentoPage.acceptPrivacy();

      // Submit the form
      await talentoPage.submit();

      // Verify successful redirect
      await talentoPage.verifySuccessRedirect();

      // Verify modal appears
      await talentoPage.verifyModalVisible();
    },
  );

  test(
    "Talent form validation - required fields",
    { tag: ["@high", "@e2e", "@talento"] },
    async ({ page }) => {
      const talentoPage = new TalentoPage(page);

      await talentoPage.goto();

      // Try to submit without filling required fields
      await talentoPage.submitButton.click();

      // Form should not submit (HTML5 validation)
      const isValid = await page.evaluate(() => {
        const form = document.querySelector(
          'form[action="/api/talent"]',
        ) as HTMLFormElement;
        return form ? form.checkValidity() : false;
      });

      expect(isValid).toBeFalsy();
    },
  );

  test(
    "Talent form with minimal data and CV",
    { tag: ["@high", "@e2e", "@talento"] },
    async ({ page }) => {
      const talentoPage = new TalentoPage(page);
      const cvPath = path.resolve(__dirname, "../fixtures/test-cv.pdf");

      await talentoPage.goto();

      // Fill only required fields
      await talentoPage.fillForm({
        nombre: "Test Candidate",
        email: "candidate@example.com",
      });

      // Upload CV (required)
      await talentoPage.uploadCV(cvPath);

      // Accept privacy policy
      await talentoPage.acceptPrivacy();

      // Submit the form
      await talentoPage.submit();

      // Should redirect successfully
      await talentoPage.verifySuccessRedirect();
    },
  );
});
