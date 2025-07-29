import { useState } from 'react';
import { useFila } from '../hooks/useFila';

export const EntrarFilaForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    servico: 'corte',
    barbeiro: 'qualquer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { entrarFila } = useFila();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const result = await entrarFila(formData);
      
      if (result.success) {
        setSuccess(true);
        setFormData({
          nome: '',
          telefone: '',
          servico: 'corte',
          barbeiro: 'qualquer'
        });
      } else {
        setError(result.error || 'Erro ao entrar na fila');
      }
    } catch (error) {
      setError('Erro ao entrar na fila. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Sucesso!
        </h3>
        <p className="text-green-700 mb-4">
          Você foi adicionado à fila com sucesso. Acompanhe sua posição em tempo real.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Adicionar Outro
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-black mb-2">
          Entrar na Fila
        </h2>
        <p className="text-gray-600">
          Preencha seus dados para entrar na fila
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Seu nome completo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="(81) 99999-9999"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Serviço
          </label>
          <select
            name="servico"
            value={formData.servico}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="corte">Corte Masculino</option>
            <option value="barba">Barba</option>
            <option value="corte_barba">Corte + Barba</option>
            <option value="hidratacao">Hidratação</option>
            <option value="pigmentacao">Pigmentação</option>
            <option value="completo">Pacote Completo</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Barbeiro Preferido
          </label>
          <select
            name="barbeiro"
            value={formData.barbeiro}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="qualquer">Qualquer barbeiro</option>
            <option value="lucas">Lucas</option>
            <option value="joao">João</option>
            <option value="pedro">Pedro</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Entrando na fila...' : 'Entrar na Fila'}
        </button>
      </form>
    </div>
  );
}; 