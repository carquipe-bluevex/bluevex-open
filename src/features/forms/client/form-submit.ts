export function initAsyncForm(selector: string, successRedirectUrl: string) {
  const form = document.querySelector<HTMLFormElement>(selector);

  if (!form || form.dataset.jsBound === "true") {
    return;
  }

  form.dataset.jsBound = "true";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
    });

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (response.ok) {
      window.location.href = successRedirectUrl;
    }
  });
}
