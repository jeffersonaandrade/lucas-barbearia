import { useState, useEffect } from 'react';
import { barbeariasService } from '@/services/api.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

const ApiTest = () => {
  const [barbearias, setBarbearias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rawResponse, setRawResponse] = useState('');

  const testarAPI = async () => {
    setLoading(true);
    setError('');
    setRawResponse('');

    try {
      console.log('🔄 Testando API de barbearias...');
      const response = await barbeariasService.listarBarbearias();
      
      console.log('✅ Resposta completa da API:', response);
      setRawResponse(JSON.stringify(response, null, 2));
      
      if (response.data && Array.isArray(response.data)) {
        setBarbearias(response.data);
        console.log(`📊 Encontradas ${response.data.length} barbearias`);
      } else {
        console.log('⚠️ Resposta não tem formato esperado:', response);
        setError('Resposta da API não tem formato esperado');
      }
    } catch (error) {
      console.error('❌ Erro ao testar API:', error);
      setError(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testarCriarBarbearia = async () => {
    setLoading(true);
    setError('');

    try {
      const novaBarbearia = {
        nome: 'Barbearia Teste API',
        endereco: 'Rua Teste, 123 - Teste',
        telefone: '11999999999',
        whatsapp: '11999999999',
        instagram: 'teste',
        ativo: true,
        configuracoes: {
          tempo_medio_atendimento: 30,
          max_clientes_fila: 20,
          permitir_agendamento: false,
          mostrar_tempo_estimado: true
        },
        horario: {
          segunda: { aberto: true, inicio: '08:00', fim: '18:00' },
          terca: { aberto: true, inicio: '08:00', fim: '18:00' },
          quarta: { aberto: true, inicio: '08:00', fim: '18:00' },
          quinta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sexta: { aberto: true, inicio: '08:00', fim: '18:00' },
          sabado: { aberto: true, inicio: '08:00', fim: '18:00' },
          domingo: { aberto: false, inicio: '', fim: '' }
        },
        servicos: [
          {
            nome: 'Corte Teste',
            preco: 25.00,
            duracao: 30,
            descricao: 'Corte para teste'
          }
        ]
      };

      console.log('🔄 Criando barbearia de teste...');
      const response = await barbeariasService.criarBarbearia(novaBarbearia);
      console.log('✅ Barbearia criada:', response);
      
      // Recarregar lista
      await testarAPI();
    } catch (error) {
      console.error('❌ Erro ao criar barbearia:', error);
      setError(`Erro ao criar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teste da API de Barbearias</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testarAPI} disabled={loading}>
          {loading ? 'Testando...' : 'Testar Listagem de Barbearias'}
        </Button>
        
        <Button onClick={testarCriarBarbearia} disabled={loading} variant="outline">
          {loading ? 'Criando...' : 'Criar Barbearia de Teste'}
        </Button>
      </div>

      {error && (
        <Card className="mb-4 border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {rawResponse && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Resposta Bruta da API</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
              {rawResponse}
            </pre>
          </CardContent>
        </Card>
      )}

      {barbearias.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Barbearias Encontradas ({barbearias.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {barbearias.map((barbearia, index) => (
                <div key={index} className="border p-4 rounded">
                  <h3 className="font-semibold">{barbearia.nome}</h3>
                  <p className="text-sm text-gray-600">{barbearia.endereco}</p>
                  <p className="text-sm text-gray-600">Telefone: {barbearia.telefone}</p>
                  <p className="text-sm text-gray-600">Status: {barbearia.ativo ? 'Ativa' : 'Inativa'}</p>
                  {barbearia.servicos && (
                    <p className="text-sm text-gray-600">
                      Serviços: {barbearia.servicos.length}
                    </p>
                  )}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-blue-600">Ver dados completos</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(barbearia, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {barbearias.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600">Nenhuma barbearia encontrada. Clique em "Testar Listagem" para verificar.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApiTest; 