import { useState, useEffect } from 'react';
import { barbeariasService } from '@/services/api.js';

// Hook para carregar dados básicos de uma barbearia específica
export const useConfiguracoesPublicas = (barbeariaId) => {
  const [barbearia, setBarbearia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarBarbearia = async () => {
    if (!barbeariaId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await barbeariasService.obterBarbearia(barbeariaId);
      const barbeariaData = data.data;
      
      // Adicionar dados estáticos de serviços e horários
      const barbeariaCompleta = {
        ...barbeariaData,
        servicos: [
          {
            id: 1,
            nome: 'Corte Masculino',
            preco: 35.00,
            duracao: 30,
            descricao: 'Corte tradicional ou moderno com acabamento perfeito',
            categoria: 'corte'
          },
          {
            id: 2,
            nome: 'Barba',
            preco: 25.00,
            duracao: 20,
            descricao: 'Acabamento de barba com navalha e produtos premium',
            categoria: 'barba'
          },
          {
            id: 3,
            nome: 'Corte + Barba',
            preco: 50.00,
            duracao: 45,
            descricao: 'Combo completo com desconto especial',
            categoria: 'combo'
          }
        ],
        horarios: [
          { dia: 'Segunda-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Terça-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Quarta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Quinta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Sexta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Sábado', inicio: '08:00', fim: '17:00', ativo: true },
          { dia: 'Domingo', inicio: '08:00', fim: '12:00', ativo: false }
        ]
      };
      
      setBarbearia(barbeariaCompleta);
    } catch (error) {
      console.error('Erro ao carregar dados da barbearia:', error);
      setError(error.message || 'Erro ao carregar dados da barbearia');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (barbeariaId) {
      carregarBarbearia();
    }
  }, [barbeariaId]);

  return {
    barbearia,
    loading,
    error,
    carregarBarbearia
  };
};

// Hook para carregar dados básicos de todas as barbearias
export const useConfiguracoesTodasBarbearias = () => {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarTodasBarbearias = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Buscar apenas dados básicos das barbearias (públicos)
      const response = await barbeariasService.listarBarbearias();
      const barbeariasData = response.data || [];
      
      // Adicionar dados estáticos de serviços para cada barbearia
      const barbeariasComServicos = barbeariasData.map(barbearia => ({
        ...barbearia,
        servicos: [
          {
            id: 1,
            nome: 'Corte Masculino',
            preco: 35.00,
            duracao: 30,
            descricao: 'Corte tradicional ou moderno com acabamento perfeito',
            categoria: 'corte'
          },
          {
            id: 2,
            nome: 'Barba',
            preco: 25.00,
            duracao: 20,
            descricao: 'Acabamento de barba com navalha e produtos premium',
            categoria: 'barba'
          },
          {
            id: 3,
            nome: 'Corte + Barba',
            preco: 50.00,
            duracao: 45,
            descricao: 'Combo completo com desconto especial',
            categoria: 'combo'
          }
        ],
        horarios: [
          { dia: 'Segunda-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Terça-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Quarta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Quinta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Sexta-feira', inicio: '09:00', fim: '18:00', ativo: true },
          { dia: 'Sábado', inicio: '08:00', fim: '17:00', ativo: true },
          { dia: 'Domingo', inicio: '08:00', fim: '12:00', ativo: false }
        ]
      }));
      
      setBarbearias(barbeariasComServicos);
    } catch (error) {
      console.error('Erro ao carregar barbearias:', error);
      setError(error.message || 'Erro ao carregar barbearias');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarTodasBarbearias();
  }, []);

  return {
    barbearias,
    loading,
    error,
    carregarTodasBarbearias
  };
}; 