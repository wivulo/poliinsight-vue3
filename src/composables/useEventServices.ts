import { ref, Ref } from 'vue';
import EventServices from "@/services/EventServices";
import { useNotification } from "@/composables/useNotification";

interface EventType {
  id?: number;
  [key: string]: any;
}

// Composable para centralizar operações de eventos
export function useEventServices() {
  const busy: Ref<boolean> = ref(false);
  const events: Ref<EventType[]> = ref([]);
  const { notifyError } = useNotification();

  async function fetchEventsOrganizer(organizerId: number): Promise<void> {
    busy.value = true;
    try {
      const response = await EventServices.fetchEventsOrganizer(organizerId);
      if (response.status === 200) {
        events.value = response.data.map((eve: EventType, i: number) => ({ ...eve, int_id: i + 1 }));
      } else {
        notifyError('Erro ao buscar os eventos');
      }
    } catch (error) {
      notifyError('Erro ao buscar os eventos');
    } finally {
      busy.value = false;
    }
  }

  async function fetchEvents(): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.fetchEvents();
    } catch (error) {
      notifyError('Erro ao carregar a lista de eventos');
    } finally {
      busy.value = false;
    }
  }

  async function index(params: any): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.index(params);
    } catch (error) {
      notifyError('Erro ao obter eventos');
    } finally {
      busy.value = false;
    }
  }

  async function public_index(params: any): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.public_index(params);
    } catch (error) {
      notifyError('Erro ao obter eventos públicos');
    } finally {
      busy.value = false;
    }
  }

  async function createEvent(event: EventType): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.createEvent(event);
    } catch (error) {
      notifyError('Erro ao criar o evento');
    } finally {
      busy.value = false;
    }
  }

  async function update(event: EventType): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.update(event);
    } catch (error) {
      notifyError('Erro ao atualizar o evento');
    } finally {
      busy.value = false;
    }
  }

  async function show(id: number): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.show(id);
    } catch (error) {
      notifyError('Erro ao buscar o evento');
    } finally {
      busy.value = false;
    }
  }

  async function showPublic(id: number): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.showPublic(id);
    } catch (error) {
      notifyError('Erro ao buscar o evento público');
    } finally {
      busy.value = false;
    }
  }

  async function remove(id: number): Promise<any> {  // 'delete' é palavra reservada
    busy.value = true;
    try {
      return await EventServices.delete(id);
    } catch (error) {
      notifyError('Erro ao deletar o evento');
    } finally {
      busy.value = false;
    }
  }

  async function search(params: any): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.search(params);
    } catch (error) {
      notifyError('Erro na busca de eventos');
    } finally {
      busy.value = false;
    }
  }

  async function getStatistic(eventId: number): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.getStatistic(eventId);
    } catch (error) {
      notifyError('Erro ao obter estatísticas do evento');
    } finally {
      busy.value = false;
    }
  }

  async function changeStatus(eventId: number, statusId: number): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.changeStatus(eventId, statusId);
    } catch (error) {
      notifyError('Erro ao alterar o status do evento');
    } finally {
      busy.value = false;
    }
  }

  async function feedback(eventId: number, feedbackData: any): Promise<any> {
    busy.value = true;
    try {
      return await EventServices.feedback(eventId, feedbackData);
    } catch (error) {
      notifyError('Erro ao enviar feedback');
    } finally {
      busy.value = false;
    }
  }

  return {
    busy,
    events,
    fetchEventsOrganizer,
    fetchEvents,
    index,
    public_index,
    createEvent,
    update,
    show,
    showPublic,
    remove,
    search,
    getStatistic,
    changeStatus,
    feedback
  };
}