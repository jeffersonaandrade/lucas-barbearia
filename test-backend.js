// Script para testar se o backend está funcionando
const API_URL = 'http://localhost:3000/api';

async function testBackend() {
  console.log('🧪 Testando conectividade com o backend...');
  console.log(`📍 URL: ${API_URL}`);
  
  try {
    // Teste 1: Health check
    console.log('\n1️⃣ Testando health check...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log(`✅ Health check: ${healthResponse.status} ${healthResponse.statusText}`);
    console.log('📊 Dados:', healthData);
    
    // Teste 2: Login
    console.log('\n2️⃣ Testando login...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@lucasbarbearia.com',
        password: 'admin123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    console.log(`✅ Login: ${loginResponse.status} ${loginResponse.statusText}`);
    console.log('📊 Dados:', loginData);
    
    if (loginData.token) {
      console.log('🎫 Token recebido:', loginData.token.substring(0, 20) + '...');
      
      // Teste 3: Verificar usuário atual
      console.log('\n3️⃣ Testando verificação de usuário...');
      const userResponse = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json',
        }
      });
      
      const userData = await userResponse.json();
      
      console.log(`✅ Usuário atual: ${userResponse.status} ${userResponse.statusText}`);
      console.log('📊 Dados:', userData);
    }
    
    console.log('\n🎉 Todos os testes passaram! O backend está funcionando corretamente.');
    
  } catch (error) {
    console.error('\n❌ Erro ao testar backend:', error.message);
    console.log('\n🔧 Possíveis soluções:');
    console.log('1. Verifique se o backend está rodando em http://localhost:3000');
    console.log('2. Verifique se não há firewall bloqueando a porta 3000');
    console.log('3. Verifique se o CORS está configurado corretamente no backend');
  }
}

// Executar teste
testBackend(); 