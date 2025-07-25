import { useState } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { usuariosService } from '@/services/api.js';
import { useAuthBackend } from '@/hooks/useAuthBackend.js';

const TestUserCreation = () => {
  const { user, apiStatus } = useAuthBackend();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    role: 'barbeiro',
    telefone: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      console.log('🚀 Tentando criar usuário...');
      console.log('📋 Dados:', formData);
      console.log('🔧 Status da API:', apiStatus);

      // Preparar dados corretos para o backend
      const dadosUsuario = {
        nome: formData.nome,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        telefone: formData.telefone || undefined
      };

      console.log('📤 Dados enviados para API:', dadosUsuario);
      const response = await usuariosService.criarUsuario(dadosUsuario);
      
      console.log('✅ Usuário criado:', response);
      setResult(response);
    } catch (err) {
      console.error('❌ Erro ao criar usuário:', err);
      setError(err.message || 'Erro ao criar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Criação de Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Status da API:</strong> {apiStatus}
            </p>
            <p className="text-sm">
              <strong>Usuário logado:</strong> {user?.email || 'Nenhum'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome do usuário"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Senha"
                required
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone (opcional)</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="(81) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="admin">Admin</option>
                <option value="gerente">Gerente</option>
                <option value="barbeiro">Barbeiro</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading || apiStatus !== 'available'}
              className="w-full"
            >
              {loading ? 'Criando...' : 'Criar Usuário'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Usuário criado com sucesso!</strong>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestUserCreation; 