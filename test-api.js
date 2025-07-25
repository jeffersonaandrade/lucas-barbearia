const fetch = require('node-fetch');

async function testAPI() {
  console.log('🧪 Testando conectividade da API...\n');

  try {
    // Teste 1: Health check
    console.log('1️⃣ Testando /api/health...');
    const healthResponse = await fetch('http://localhost:3000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
  } catch (error) {
    console.log('❌ Health check falhou:', error.message);
  }

  try {
    // Teste 2: Login
    console.log('\n2️⃣ Testando /api/auth/login...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
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
    console.log('✅ Login response:', loginData);
    console.log('📊 Status:', loginResponse.status);
  } catch (error) {
    console.log('❌ Login falhou:', error.message);
  }

  try {
    // Teste 3: Criar usuário
    console.log('\n3️⃣ Testando /api/users...');
    const userResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Teste Usuário',
        email: 'teste@exemplo.com',
        password: 'senha123',
        role: 'barbeiro',
        telefone: '(11) 99999-9999'
      })
    });
    
    const userData = await userResponse.json();
    console.log('✅ Criar usuário response:', userData);
    console.log('📊 Status:', userResponse.status);
  } catch (error) {
    console.log('❌ Criar usuário falhou:', error.message);
  }
}

testAPI(); 