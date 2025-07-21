export const instagramVideos = [
  {
    id: 1,
    title: 'Você confiaria a saúde do seu filho a alguém que você nunca viu?',
    description: 'Dicas importantes sobre como escolher um profissional de confiança para cuidar da respiração do seu filho. A Tia Jow explica os critérios essenciais.',
    postUrl: 'https://www.instagram.com/p/DMIGXRwuplp/',
    publishedAt: '2024-01-15',
    category: 'Dicas para pais'
  },
  {
    id: 2,
    title: 'Fumaça e cheiros fortes - Como proteger seu pequeno',
    description: 'Orientações práticas para proteger crianças de irritantes respiratórios no ambiente doméstico. Dicas da Tia Jow para um ambiente mais saudável.',
    postUrl: 'https://www.instagram.com/p/C4W9K3L2P7R/',
    publishedAt: '2024-01-08',
    category: 'Cuidados em casa'
  },
  {
    id: 3,
    title: 'Seu filho respira bem? 3 sinais que o pulmão dele pode precisar de ajuda',
    description: 'Aprenda a identificar sinais importantes que podem indicar problemas respiratórios em crianças. A Tia Jow ensina o que observar.',
    postUrl: 'https://www.instagram.com/p/C4V5M8N1Q6S/',
    publishedAt: '2024-01-01',
    category: 'Sinais de alerta'
  },
  {
    id: 4,
    title: 'Ambiente, vínculo e respeito - As peças-chave do cuidado',
    description: 'Como criar um ambiente acolhedor que favorece o tratamento e a recuperação da criança. A filosofia da Tia Jow.',
    postUrl: 'https://www.instagram.com/p/C4U2K7L9P4T/',
    publishedAt: '2023-12-25',
    category: 'Abordagem humanizada'
  },
  {
    id: 5,
    title: 'Exercícios respiratórios para crianças - Técnicas da Tia Jow',
    description: 'Técnicas simples e eficazes que você pode fazer em casa com seu filho para melhorar a respiração. Exercícios práticos e divertidos.',
    postUrl: 'https://www.instagram.com/p/C4T8N4M2Q1U/',
    publishedAt: '2023-12-18',
    category: 'Exercícios práticos'
  },
  {
    id: 6,
    title: 'Quando procurar um fisioterapeuta respiratório?',
    description: 'Saiba identificar o momento certo para buscar ajuda profissional para a respiração do seu filho. Orientação da Tia Jow.',
    postUrl: 'https://www.instagram.com/p/C4S5K1L7P9V/',
    publishedAt: '2023-12-11',
    category: 'Orientação médica'
  },
  {
    id: 7,
    title: 'Respiração saudável desde cedo - Dicas para bebês',
    description: 'Como estimular uma respiração saudável desde os primeiros meses de vida. Técnicas da Tia Jow para bebês.',
    postUrl: 'https://www.instagram.com/p/C4R2K8L4P6W/',
    publishedAt: '2023-12-04',
    category: 'Cuidados em casa'
  },
  {
    id: 8,
    title: 'Bronquite em crianças - Como a fisioterapia pode ajudar',
    description: 'Entenda como a fisioterapia respiratória pode ser fundamental no tratamento da bronquite infantil. Explicação da Tia Jow.',
    postUrl: 'https://www.instagram.com/p/C4Q9K5L1P3X/',
    publishedAt: '2023-11-27',
    category: 'Orientação médica'
  }
];

// Categorias disponíveis
export const videoCategories = [
  'Todos',
  'Dicas para pais',
  'Cuidados em casa',
  'Sinais de alerta',
  'Abordagem humanizada',
  'Exercícios práticos',
  'Orientação médica'
];

// Função para filtrar vídeos por categoria
export const filterVideosByCategory = (videos, category) => {
  if (category === 'Todos') return videos;
  return videos.filter(video => video.category === category);
};

// Função para obter vídeos mais recentes
export const getRecentVideos = (videos, limit = 4) => {
  return videos
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    .slice(0, limit);
};

// Função para obter vídeos por categoria com contagem
export const getVideosByCategory = (videos) => {
  const categories = {};
  videoCategories.forEach(category => {
    if (category !== 'Todos') {
      categories[category] = videos.filter(video => video.category === category).length;
    }
  });
  return categories;
}; 