// Teste específico para login
const API_URL = 'http://localhost:3000/api';

async function testLogin() {
  console.log('🔐 Testando login com credenciais...');
  
  const credentials = {
    email: 'admin@lucasbarbearia.com',
    password: 'admin123' // Sem espaços
  };
  
  console.log('📧 Email:', credentials.email);
  console.log('🔑 Senha:', `"${credentials.password}"`); // Mostra se há espaços
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    
    console.log(`📡 Status: ${response.status} ${response.statusText}`);
    console.log('📊 Resposta:', data);
    
    if (response.ok) {
      console.log('✅ Login bem-sucedido!');
      console.log('🎫 Token:', data.data?.token ? 'Recebido' : 'Não recebido');
      console.log('👤 Usuário:', data.data?.user?.email);
    } else {
      console.log('❌ Login falhou');
      console.log('🔍 Erro:', data.error || data.message);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

// Executar teste
testLogin(); 