// Utilitário para migração de dados do localStorage para o backend
import { barbeariasService, filaService } from '@/services/api.js';
import barbeariasData from '@/data/barbearias.json';
import filaData from '@/data/fila.json';

export class MigrationService {
  constructor() {
    this.migrationKey = 'lucas_barbearia_migration_completed';
  }

  // Verificar se a migração já foi feita
  isMigrationCompleted() {
    return localStorage.getItem(this.migrationKey) === 'true';
  }

  // Marcar migração como concluída
  markMigrationCompleted() {
    localStorage.setItem(this.migrationKey, 'true');
  }

  // Migrar dados das barbearias
  async migrateBarbearias() {
    try {
      console.log('🔄 Iniciando migração das barbearias...');
      
      const barbearias = barbeariasData.barbearias;
      
      for (const barbearia of barbearias) {
        try {
          // Verificar se a barbearia já existe
          const existingBarbearia = await barbeariasService.obterBarbearia(barbearia.id);
          
          if (!existingBarbearia) {
            // Criar barbearia no backend
            const barbeariaData = {
              id: barbearia.id,
              nome: barbearia.nome,
              endereco: barbearia.endereco,
              telefone: barbearia.telefone,
              whatsapp: barbearia.whatsapp,
              instagram: barbearia.instagram,
              horario: barbearia.horario,
              configuracoes: barbearia.configuracoes,
              servicos: barbearia.servicos,
              ativo: barbearia.ativo
            };
            
            await barbeariasService.criarBarbearia(barbeariaData);
            console.log(`✅ Barbearia ${barbearia.nome} migrada com sucesso`);
          } else {
            console.log(`ℹ️ Barbearia ${barbearia.nome} já existe no backend`);
          }
        } catch (error) {
          console.error(`❌ Erro ao migrar barbearia ${barbearia.nome}:`, error);
        }
      }
      
      console.log('✅ Migração das barbearias concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração das barbearias:', error);
      return false;
    }
  }

  // Migrar dados da fila
  async migrateFila() {
    try {
      console.log('🔄 Iniciando migração da fila...');
      
      const filas = filaData.barbearias;
      
      for (const [barbeariaId, filaData] of Object.entries(filas)) {
        try {
          const clientes = filaData.fila;
          
          for (const cliente of clientes) {
            try {
              // Verificar se o cliente já existe
              const existingCliente = await filaService.obterStatusCliente(barbeariaId, cliente.token);
              
              if (!existingCliente) {
                // Adicionar cliente à fila no backend
                const clienteData = {
                  nome: cliente.nome,
                  telefone: cliente.telefone,
                  barbeiro_id: cliente.barbeiro === 'Fila Geral' ? null : cliente.barbeiro,
                  token: cliente.token,
                  status: cliente.status,
                  posicao: cliente.posicao,
                  tempo_estimado: cliente.tempoEstimado,
                  data_entrada: cliente.dataEntrada
                };
                
                await filaService.adicionarClienteManual(barbeariaId, clienteData);
                console.log(`✅ Cliente ${cliente.nome} migrado para barbearia ${barbeariaId}`);
              } else {
                console.log(`ℹ️ Cliente ${cliente.nome} já existe na fila da barbearia ${barbeariaId}`);
              }
            } catch (error) {
              console.error(`❌ Erro ao migrar cliente ${cliente.nome}:`, error);
            }
          }
        } catch (error) {
          console.error(`❌ Erro ao migrar fila da barbearia ${barbeariaId}:`, error);
        }
      }
      
      console.log('✅ Migração da fila concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração da fila:', error);
      return false;
    }
  }

  // Executar migração completa
  async executeMigration() {
    if (this.isMigrationCompleted()) {
      console.log('ℹ️ Migração já foi executada anteriormente');
      return true;
    }

    try {
      console.log('🚀 Iniciando migração completa...');
      
      // Migrar barbearias primeiro
      const barbeariasSuccess = await this.migrateBarbearias();
      
      if (!barbeariasSuccess) {
        throw new Error('Falha na migração das barbearias');
      }
      
      // Aguardar um pouco antes de migrar a fila
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Migrar fila
      const filaSuccess = await this.migrateFila();
      
      if (!filaSuccess) {
        throw new Error('Falha na migração da fila');
      }
      
      // Marcar migração como concluída
      this.markMigrationCompleted();
      
      console.log('🎉 Migração concluída com sucesso!');
      return true;
    } catch (error) {
      console.error('❌ Erro na migração completa:', error);
      return false;
    }
  }

  // Limpar dados do localStorage após migração
  clearLocalStorageData() {
    try {
      const keysToRemove = [
        'lucas_barbearia_fila_data',
        'lucas_barbearia_barbearias_data',
        'fila_token',
        'cliente_data',
        'fila_barbearia_id',
        'fila_timestamp'
      ];
      
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log('🧹 Dados do localStorage limpos após migração');
      return true;
    } catch (error) {
      console.error('❌ Erro ao limpar localStorage:', error);
      return false;
    }
  }

  // Verificar integridade dos dados migrados
  async verifyMigrationIntegrity() {
    try {
      console.log('🔍 Verificando integridade da migração...');
      
      // Verificar se as barbearias foram migradas
      const barbeariasData = await barbeariasService.listarBarbearias();
      const barbearias = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
        ? barbeariasData.data 
        : [];
      const expectedBarbearias = barbeariasData.barbearias.length;
      
      if (barbearias.length < expectedBarbearias) {
        console.warn(`⚠️ Apenas ${barbearias.length}/${expectedBarbearias} barbearias foram migradas`);
        return false;
      }
      
      // Verificar se as filas foram migradas
      for (const barbearia of barbearias) {
        try {
          const fila = await filaService.obterFila(barbearia.id);
          const expectedClientes = filaData.barbearias[barbearia.id]?.fila?.length || 0;
          
          if (fila.fila.length < expectedClientes) {
            console.warn(`⚠️ Barbearia ${barbearia.nome}: ${fila.fila.length}/${expectedClientes} clientes migrados`);
          }
        } catch (error) {
          console.error(`❌ Erro ao verificar fila da barbearia ${barbearia.id}:`, error);
        }
      }
      
      console.log('✅ Verificação de integridade concluída');
      return true;
    } catch (error) {
      console.error('❌ Erro na verificação de integridade:', error);
      return false;
    }
  }

  // Rollback da migração (remover dados do backend)
  async rollbackMigration() {
    try {
      console.log('🔄 Iniciando rollback da migração...');
      
      // Remover dados da fila
      const barbeariasData = await barbeariasService.listarBarbearias();
      const barbearias = (barbeariasData && barbeariasData.data && Array.isArray(barbeariasData.data)) 
        ? barbeariasData.data 
        : [];
      
      for (const barbearia of barbearias) {
        try {
          const fila = await filaService.obterFila(barbearia.id);
          
          // Remover todos os clientes da fila
          for (const cliente of fila.fila) {
            try {
              await filaService.removerCliente(barbearia.id, cliente.id);
            } catch (error) {
              console.error(`❌ Erro ao remover cliente ${cliente.id}:`, error);
            }
          }
          
          console.log(`✅ Fila da barbearia ${barbearia.nome} limpa`);
        } catch (error) {
          console.error(`❌ Erro ao limpar fila da barbearia ${barbearia.id}:`, error);
        }
      }
      
      // Remover barbearias
      for (const barbearia of barbearias) {
        try {
          await barbeariasService.removerBarbearia(barbearia.id);
          console.log(`✅ Barbearia ${barbearia.nome} removida`);
        } catch (error) {
          console.error(`❌ Erro ao remover barbearia ${barbearia.id}:`, error);
        }
      }
      
      // Limpar flag de migração
      localStorage.removeItem(this.migrationKey);
      
      console.log('✅ Rollback concluído');
      return true;
    } catch (error) {
      console.error('❌ Erro no rollback:', error);
      return false;
    }
  }
}

// Instância global do serviço de migração
export const migrationService = new MigrationService();

// Função de conveniência para executar migração
export const executeMigration = async () => {
  return await migrationService.executeMigration();
};

// Função para verificar se deve usar API ou localStorage
export const shouldUseAPI = () => {
  // Verificar se a API está disponível
  return new Promise(async (resolve) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/health`, {
        method: 'GET',
        timeout: 5000,
      });
      
      resolve(response.ok);
    } catch (error) {
      console.warn('API não está disponível, usando localStorage');
      resolve(false);
    }
  });
};

export default migrationService; 