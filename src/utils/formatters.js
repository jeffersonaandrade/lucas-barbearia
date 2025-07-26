// Utilitários para formatação de dados dos dashboards

/**
 * Formata hora a partir de data_fim
 * @param {string} dataFim - Data de fim no formato ISO
 * @returns {string|null} Hora formatada ou null
 */
export const formatarHora = (dataFim) => {
  if (!dataFim) return null;
  try {
    const data = new Date(dataFim);
    return data.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    console.error('Erro ao formatar hora:', error);
    return null;
  }
};

/**
 * Formata data a partir de data_fim
 * @param {string} dataFim - Data de fim no formato ISO
 * @returns {string|null} Data formatada ou null
 */
export const formatarData = (dataFim) => {
  if (!dataFim) return null;
  try {
    const data = new Date(dataFim);
    return data.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return null;
  }
};

/**
 * Calcula tempo de espera em minutos
 * @param {string} dataEntrada - Data de entrada
 * @param {string} created_at - Data de criação (fallback)
 * @returns {number} Tempo de espera em minutos
 */
export const calcularTempoEspera = (dataEntrada, created_at) => {
  const tempoEntrada = dataEntrada ? new Date(dataEntrada).getTime() : 
                      created_at ? new Date(created_at).getTime() : 
                      Date.now();
  
  return Math.floor((Date.now() - tempoEntrada) / 1000 / 60);
};

/**
 * Formata tempo de espera para exibição
 * @param {number} minutos - Tempo em minutos
 * @returns {string} Tempo formatado
 */
export const formatarTempoEspera = (minutos) => {
  if (minutos < 60) {
    return `${minutos} min`;
  }
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (mins === 0) {
    return `${horas}h`;
  }
  
  return `${horas}h ${mins}min`;
};

/**
 * Formata nome do cliente para exibição
 * @param {object} cliente - Objeto do cliente
 * @returns {string} Nome formatado
 */
export const formatarNomeCliente = (cliente) => {
  return cliente.nome || cliente.nome_cliente || 'Cliente';
};

/**
 * Formata telefone do cliente para exibição
 * @param {object} cliente - Objeto do cliente
 * @returns {string} Telefone formatado
 */
export const formatarTelefoneCliente = (cliente) => {
  return cliente.telefone || cliente.telefone_cliente || 'N/A';
};

/**
 * Formata serviço do cliente para exibição
 * @param {object} cliente - Objeto do cliente
 * @returns {string} Serviço formatado
 */
export const formatarServicoCliente = (cliente) => {
  return cliente.servico || 'Serviço';
};

/**
 * Formata duração do atendimento
 * @param {number} duracao - Duração em minutos
 * @returns {string} Duração formatada
 */
export const formatarDuracao = (duracao) => {
  return `${duracao || 0} min`;
};

/**
 * Verifica se um cliente pode ser atendido por um barbeiro
 * @param {object} cliente - Objeto do cliente
 * @param {string} nomeBarbeiro - Nome do barbeiro
 * @returns {boolean} Se pode ser atendido
 */
export const podeAtenderCliente = (cliente, nomeBarbeiro) => {
  const barbeiroCliente = cliente.barbeiro || 'Fila Geral';
  return barbeiroCliente === 'Fila Geral' || 
         barbeiroCliente === 'Geral' || 
         barbeiroCliente === nomeBarbeiro;
};

/**
 * Ordena fila por tempo de chegada
 * @param {Array} fila - Array de clientes
 * @returns {Array} Fila ordenada
 */
export const ordenarFilaPorTempo = (fila) => {
  return fila
    .filter(c => c.status === 'aguardando' || !c.status)
    .sort((a, b) => {
      const tempoA = a.dataEntrada ? new Date(a.dataEntrada).getTime() : 
                    a.created_at ? new Date(a.created_at).getTime() : 
                    a.id;
      const tempoB = b.dataEntrada ? new Date(b.dataEntrada).getTime() : 
                    b.created_at ? new Date(b.created_at).getTime() : 
                    b.id;
      return tempoA - tempoB;
    })
    .map((cliente, index) => {
      const tempoEntrada = cliente.dataEntrada ? new Date(cliente.dataEntrada).getTime() : 
                          cliente.created_at ? new Date(cliente.created_at).getTime() : 
                          Date.now();
      
      return {
        ...cliente,
        posicaoTempo: index + 1,
        tempoEspera: calcularTempoEspera(cliente.dataEntrada, cliente.created_at),
        status: cliente.status || 'aguardando',
        barbeiro: cliente.barbeiro || 'Fila Geral'
      };
    });
}; 