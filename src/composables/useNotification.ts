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

  return { notify };
}