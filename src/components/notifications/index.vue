<!-- NotificationPanel.vue -->
<script setup>
import { ref, onMounted, computed } from 'vue';
import notificationService from '@/services/notificationService';
import { useStore } from 'vuex'
import OverlayPanel from 'primevue/overlaypanel';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import BaseGrayButton from '../../layouts/components/BaseGrayButton.vue';

const store = useStore()

const notificationPanel = ref(null);
const notifications = ref([]);

const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length;
});

const fetchNotifications = async () => {
    try {
        notifications.value = await notificationService.findNotifications();
    } catch (error) {
        console.error('Erro ao buscar notificações:', error);
    }
};

const markAsRead = async (notificationId) => {
    try {
        await notificationService.markAsRead(notificationId);
        const index = notifications.value.findIndex(n => n.id === notificationId);
        if (index !== -1) {
            notifications.value[index].isRead = true;
        }
    } catch (error) {
        console.error('Erro ao marcar notificação como lida:', error);
    }
};

const markAllAsRead = async () => {
    try {
        await notificationService.markAllAsRead();
        notifications.value = notifications.value.map(n => ({ ...n, isRead: true }));
    } catch (error) {
        console.error('Erro ao marcar todas notificações como lidas:', error);
    }
};

const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
        markAsRead(notification.id);
    }

    if (notification.link) {
        // Navegar para o link da notificação
        window.location.href = notification.link;
    }

    notificationPanel.value.hide();
};

const toggleNotifications = (event) => {
    notificationPanel.value.toggle(event);
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'success': return 'pi pi-check-circle text-green-500';
        case 'warning': return 'pi pi-exclamation-triangle text-yellow-500';
        case 'error': return 'pi pi-times-circle text-red-500';
        default: return 'pi pi-info-circle text-blue-500';
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

onMounted(() => {
    // Registrar o socket para receber notificações em tempo real
    // const userId = localStorage.getItem('userId'); // ou como você armazena o ID do usuário
    const user = computed(() => store.getters['auth/user'])

    if (user.value && user.value?.id) {
        notificationService.registerSocket(user.value.id);
        fetchNotifications();
        // Ouvir novas notificações
        notificationService.onNewNotification((notification) => {
            notifications.value = [notification, ...notifications.value];
        });
    }
});

// return {
//     notificationPanel,
//     notifications,
//     unreadCount,
//     markAsRead,
//     markAllAsRead,
//     handleNotificationClick,
//     toggleNotifications,
//     getNotificationIcon,
//     formatDate
// };
</script>

<template>
    <div>
        <div>
            <BaseGrayButton @click="toggleNotifications" text :badge="unreadCount.toString()" class="relative">
                <i class="pi pi-bell text-base" />
                <!-- <Badge v-if="unreadCount > 0" :value="unreadCount" severity="danger" class="absolute -top-1 -right-1" /> -->
            </BaseGrayButton>
        </div>

        <OverlayPanel ref="notificationPanel" class="w-80">
            <template #header>
                <div class="flex justify-between items-center p-3 border-bottom">
                    <h3 class="m-0 text-lg">Notificações</h3>
                    <Button v-if="unreadCount > 0" @click="markAllAsRead" label="Marcar todas como lidas"
                        class="p-button-text p-button-sm" />
                </div>
            </template>

            <div class="max-h-96 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
                    Nenhuma notificação
                </div>

                <div v-for="notification in notifications" :key="notification.id"
                    @click="handleNotificationClick(notification)"
                    class="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    :class="{ 'bg-blue-50': !notification.isRead }">
                    <div class="flex gap-3">
                        <div>
                            <i :class="getNotificationIcon(notification.type)" class="text-xl" />
                        </div>
                        <div>
                            <div class="font-medium">{{ notification.title }}</div>
                            <div class="text-sm text-gray-600">{{ notification.message }}</div>
                            <div class="text-xs text-gray-500 mt-1">
                                {{ formatDate(notification.createdAt) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>