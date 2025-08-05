class WhatsAppAdmin {
  constructor(token) {
    this.token = token;
    this.baseUrl = '/api/whatsapp';
  }

  // Headers padrão
  getHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Verificar status
  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/status`, {
        headers: this.getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ WhatsAppAdmin - Erro ao obter status do WhatsApp:', error);
      throw error;
    }
  }

  // Obter QR Code
  async getQRCode() {
    try {
      const response = await fetch(`${this.baseUrl}/qr`, {
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao obter QR Code:', error);
      throw error;
    }
  }

  // Informações do dispositivo
  async getDeviceInfo() {
    try {
      const response = await fetch(`${this.baseUrl}/device-info`, {
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao obter informações do dispositivo:', error);
      throw error;
    }
  }

  // Listar dispositivos
  async getDevices() {
    try {
      const response = await fetch(`${this.baseUrl}/devices`, {
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao listar dispositivos:', error);
      throw error;
    }
  }

  // Desconectar dispositivo
  async disconnectDevice(deviceId) {
    try {
      const response = await fetch(`${this.baseUrl}/disconnect-device`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ deviceId })
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao desconectar dispositivo:', error);
      throw error;
    }
  }

  // Desconectar todos
  async disconnectAllDevices() {
    try {
      const response = await fetch(`${this.baseUrl}/disconnect-all-devices`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao desconectar todos os dispositivos:', error);
      throw error;
    }
  }

  // Forçar reconexão
  async forceReconnect() {
    try {
      const response = await fetch(`${this.baseUrl}/force-reconnect`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao forçar reconexão:', error);
      throw error;
    }
  }

  // Limpar sessão
  async clearSession() {
    try {
      const response = await fetch(`${this.baseUrl}/clear-session`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao limpar sessão:', error);
      throw error;
    }
  }

  // Obter estatísticas
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        headers: this.getHeaders()
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }

  // Testar mensagem
  async testMessage(telefone, tipo, dadosTeste = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/test`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          telefone,
          tipo,
          dados_teste: dadosTeste
        })
      });
      return response.json();
    } catch (error) {
      console.error('Erro ao testar mensagem:', error);
      throw error;
    }
  }

  // Reconectar WhatsApp (alias para force-reconnect)
  async reconnect() {
    return this.forceReconnect();
  }

  // Logout WhatsApp (alias para clear-session)
  async logout() {
    return this.clearSession();
  }

  // Verificar se está conectado
  async isConnected() {
    try {
      const status = await this.getStatus();
      return status.success && status.data?.isConnected;
    } catch (error) {
      return false;
    }
  }

  // Obter informações completas
  async getFullInfo() {
    try {
      const [status, devices, stats] = await Promise.all([
        this.getStatus(),
        this.getDevices(),
        this.getStats()
      ]);

      return {
        success: true,
        data: {
          status: status.data,
          devices: devices.data,
          stats: stats.data
        }
      };
    } catch (error) {
      console.error('Erro ao obter informações completas:', error);
      throw error;
    }
  }
}

export default WhatsAppAdmin; 