type TurnstileConfig = {
  widgetSelector?: string;
  statusSelector?: string;
  callbackNames?: {
    success: string;
    expired: string;
    error: string;
  };
};

type AsyncFormOptions = {
  turnstile?: TurnstileConfig;
};

type TurnstileApi = {
  reset?: (target?: HTMLElement | string) => void;
  execute?: (target?: HTMLElement | string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    [key: string]: unknown;
  }
}

const getErrorMessage = async (response: Response) => {
  try {
    const text = (await response.text()).trim();
    return text || "Request failed";
  } catch {
    return "Request failed";
  }
};

export function initAsyncForm(
  selector: string,
  successRedirectUrl: string,
  options: AsyncFormOptions = {},
) {
  const form = document.querySelector<HTMLFormElement>(selector);

  if (!form || form.dataset.jsBound === "true") {
    return;
  }

  form.dataset.jsBound = "true";

  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  );

  const setButtonDisabled = (disabled: boolean) => {
    if (!submitButton) return;
    submitButton.disabled = disabled;
    submitButton.setAttribute("aria-disabled", disabled ? "true" : "false");
  };

  const setButtonLoading = (isLoading: boolean) => {
    if (!submitButton) return;
    const defaultLabel =
      submitButton.dataset.defaultLabel || submitButton.textContent || "Enviar";

    if (!submitButton.dataset.defaultLabel) {
      submitButton.dataset.defaultLabel = defaultLabel;
    }

    submitButton.textContent = isLoading ? "Enviando..." : defaultLabel;
  };

  const statusSelector =
    options.turnstile?.statusSelector || "[data-form-status]";
  const statusElement = form.querySelector<HTMLElement>(statusSelector);
  const setStatus = (
    message: string,
    state: "idle" | "ok" | "error" = "idle",
  ) => {
    if (!statusElement) return;
    statusElement.textContent = message;
    statusElement.dataset.state = state;
  };

  const widgetSelector =
    options.turnstile?.widgetSelector || "[data-turnstile-widget]";
  const turnstileWidget = form.querySelector<HTMLElement>(widgetSelector);
  const hasTurnstile = Boolean(turnstileWidget);
  const enforceTurnstile = hasTurnstile && !import.meta.env.DEV;

  const getTurnstileToken = () => {
    const tokenField = form.querySelector<HTMLInputElement>(
      'input[name="cf-turnstile-response"]',
    );
    return tokenField?.value.trim() || "";
  };

  const refreshTurnstileState = () => {
    if (!enforceTurnstile) return;

    const hasToken = getTurnstileToken().length > 0;
    if (hasToken) {
      setButtonDisabled(false);
      setStatus("Verificacion anti-spam completada.", "ok");
      return;
    }

    setButtonDisabled(true);
    setStatus("Completa la verificacion anti-spam para poder enviar.", "idle");
  };

  const resetTurnstile = () => {
    if (!hasTurnstile || !turnstileWidget) return;

    window.turnstile?.reset?.(turnstileWidget);
    refreshTurnstileState();
  };

  if (enforceTurnstile) {
    setButtonDisabled(true);
    setStatus("Cargando verificacion anti-spam...", "idle");

    const callbackNames = options.turnstile?.callbackNames;
    if (callbackNames) {
      window[callbackNames.success] = () => {
        refreshTurnstileState();
      };

      window[callbackNames.expired] = () => {
        setButtonDisabled(true);
        setStatus(
          "La verificacion ha caducado. Vuelve a completarla para enviar.",
          "error",
        );
      };

      window[callbackNames.error] = () => {
        setButtonDisabled(true);
        setStatus(
          "No hemos podido validar el captcha. Intenta recargarlo.",
          "error",
        );
      };
    }

    const readinessInterval = window.setInterval(() => {
      refreshTurnstileState();
    }, 350);

    window.setTimeout(() => {
      if (getTurnstileToken()) return;
      setStatus(
        "La verificacion esta tardando mas de lo normal. Si no aparece, recarga la pagina.",
        "error",
      );
    }, 8000);

    window.setTimeout(() => {
      window.clearInterval(readinessInterval);
    }, 30000);
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);

    if (enforceTurnstile && !getTurnstileToken()) {
      setButtonDisabled(true);
      setStatus("Debes completar primero la verificacion anti-spam.", "error");

      if (turnstileWidget) {
        try {
          window.turnstile?.execute?.(turnstileWidget);
        } catch {
          resetTurnstile();
        }
      }

      return;
    }

    setStatus("", "idle");
    setButtonDisabled(true);
    setButtonLoading(true);

    let response: Response;
    try {
      response = await fetch(form.action, {
        method: "POST",
        body: formData,
      });
    } catch {
      setButtonLoading(false);
      if (enforceTurnstile) {
        refreshTurnstileState();
      } else {
        setButtonDisabled(false);
      }
      setStatus(
        "No se pudo enviar el formulario. Revisa tu conexion e intentalo de nuevo.",
        "error",
      );
      return;
    }

    if (response.redirected) {
      window.location.href = response.url;
      return;
    }

    if (response.ok) {
      window.location.href = successRedirectUrl;
      return;
    }

    const errorMessage = await getErrorMessage(response);
    setButtonLoading(false);

    if (errorMessage.includes("Invalid captcha")) {
      setStatus(
        "La verificacion anti-spam no es valida o ha caducado. Intentalo de nuevo.",
        "error",
      );
      resetTurnstile();
      return;
    }

    setStatus(
      "No hemos podido procesar el formulario. Revisa los datos e intentalo de nuevo.",
      "error",
    );
    if (enforceTurnstile) {
      refreshTurnstileState();
    } else {
      setButtonDisabled(false);
    }
  });
}
