import { useToast } from "primevue/usetoast";

export function useNotification() {
  const toast = useToast();

  const notify = (severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast", summary: string, detail: string, life: number = 3000) => {
    toast.add({
      severity,
      summary,
      detail,
      life: life,
    });
  };

  const notifySuccess = (detail: string = "Operação concluida!", life: number = 3000) => notify("success", "Sucesso", detail, life);

  const notifyInfo = (summary: string, detail: string) => notify("info", summary, detail);

  const notifyWarn = (summary: string, detail: string) => notify("warn", summary, detail);

  const notifyError = (detail: string = "Ocorreu um erro inesperado. Por favor, tente novamente.") => notify("error", "Erro", detail);

  return { notify, notifySuccess, notifyInfo, notifyWarn, notifyError };
}