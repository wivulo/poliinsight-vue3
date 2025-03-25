// src/services/notificationService.js
import axios from 'axios';
import { io } from 'socket.io-client';
import { databaseURL } from "@/config"

const source = databaseURL + '/notifications'
const socket = io(source.replace('/notifications', ''), {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
});

// Tratamento de eventos do socket
socket.on('connect_error', (error) => {
  console.error('Erro de conexão com o servidor:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado do servidor:', reason);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Reconectado ao servidor após ${attemptNumber} tentativa(s)`);
});

socket.on('reconnect_error', (error) => {
  console.error('Erro ao tentar reconectar:', error.message);
});

socket.on('error', (error) => {
  console.error('Erro no socket:', error);
  // Em caso de erro fatal, considere destruir e recriar o socket
  if (socket.connected) {
    socket.disconnect();
  }
});

export default {
  socket,
  
  registerSocket(userId) {
    if (socket.connected) {
      socket.emit('register', userId);
    } else {
      // Tentar registrar quando a conexão for estabelecida
      socket.once('connect', () => {
        socket.emit('register', userId);
      });
    }
  },
  
  onNewNotification(callback) {
    socket.on('notification', callback);
  },
  
  async findNotifications() {
    try {
      const response = await axios.get(`${source}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      throw error;
    }
  },
  
  async findUnreadCount() {
    try {
      const response = await axios.get(`${source}/count`);
      return response.data.count;
    } catch (error) {
      console.error('Erro ao buscar contagem de notificações não lidas:', error);
      return 0; // Retorna 0 em caso de erro
    }
  },
  
  async markAsRead(notificationId) {
    try {
      const response = await axios.patch(`${source}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      throw error;
    }
  },
  
  async markAllAsRead() {
    try {
      const response = await axios.patch(`${source}/read-all`);
      return response.data;
    } catch (error) {
      console.error('Erro ao marcar todas notificações como lidas:', error);
      throw error;
    }
  },

  // Método para desconectar explicitamente quando não for mais necessário
  disconnect() {
    if (socket.connected) {
      socket.disconnect();
    }
  }
};