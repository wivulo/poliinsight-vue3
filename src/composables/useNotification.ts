import { useToast } from "primevue/useToast";

export function useNotification() {
  const toast = useToast();

  const notify = (severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast", summary: string, detail: string) => {
    toast.add({
      severity,
      summary,
      detail,
      life: 3000,
    });
  };

  const notifySuccess = (detail: string = "Operação concluida!") => notify("success", "Sucesso", detail);

  const notifyInfo = (summary: string, detail: string) => notify("info", summary, detail);

  const notifyWarn = (summary: string, detail: string) => notify("warn", summary, detail);

  const notifyError = (detail: string = "Ocorreu um erro inesperado. Por favor, tente novamente.") => notify("error", "Erro", detail);

  return { notify, notifySuccess, notifyInfo, notifyWarn, notifyError };
}