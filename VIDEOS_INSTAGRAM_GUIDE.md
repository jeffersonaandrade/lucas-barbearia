# 📺 Guia dos Vídeos do Instagram - Tia Jow

## 🎯 Visão Geral

O sistema de vídeos do Instagram permite exibir vídeos reais da Tia Jow diretamente no site, criando uma experiência integrada entre o Instagram e o site oficial.

## ✨ Funcionalidades Implementadas

### ✅ **Vídeos Reais do Instagram**
- Incorporação automática de posts do Instagram
- Carregamento otimizado com loading states
- Fallback elegante em caso de erro
- Responsivo em todos os dispositivos

### ✅ **Sistema de Categorias**
- Filtros por tipo de conteúdo
- Navegação intuitiva
- Contadores por categoria
- Vídeos em destaque

### ✅ **Interface Moderna**
- Design consistente com o site
- Animações suaves
- Estados de hover e loading
- Acessibilidade completa

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── Videos.jsx                    # Componente principal
│   └── ui/
│       ├── instagram-embed.jsx       # Embed do Instagram
│       └── video-manager.jsx         # Gerenciador (dev)
├── data/
│   └── instagram-videos.js           # Dados dos vídeos
└── hooks/
    └── use-whatsapp.js               # Integração WhatsApp
```

## 🎬 Como Adicionar Novos Vídeos

### 1. **Obter URL do Post do Instagram**
- Vá para o post no Instagram
- Clique em "Compartilhar" → "Copiar link"
- O link deve ser no formato: `https://www.instagram.com/p/XXXXX/`

### 2. **Editar o Arquivo de Dados**
Abra `src/data/instagram-videos.js` e adicione um novo objeto:

```javascript
{
  id: 9, // Próximo número sequencial
  title: 'Título do vídeo',
  description: 'Descrição detalhada do conteúdo do vídeo',
  postUrl: 'https://www.instagram.com/p/XXXXX/',
  publishedAt: '2024-01-20', // Data de publicação (YYYY-MM-DD)
  category: 'Dicas para pais' // Categoria escolhida
}
```

### 3. **Categorias Disponíveis**
- **Dicas para pais**: Orientações gerais
- **Cuidados em casa**: Técnicas para aplicar em casa
- **Sinais de alerta**: Quando procurar ajuda
- **Abordagem humanizada**: Filosofia da Tia Jow
- **Exercícios práticos**: Técnicas e exercícios
- **Orientação médica**: Informações técnicas

## 🔧 Componentes Principais

### **InstagramEmbed**
```jsx
<InstagramEmbed
  postUrl="https://www.instagram.com/p/XXXXX/"
  title="Título do vídeo"
  description="Descrição do conteúdo"
  className="h-full"
/>
```

**Props:**
- `postUrl`: URL do post do Instagram (obrigatório)
- `title`: Título do vídeo
- `description`: Descrição do conteúdo
- `className`: Classes CSS adicionais
- `showTitle`: Mostrar título (padrão: true)
- `showDescription`: Mostrar descrição (padrão: true)

### **Videos Component**
```jsx
import { Videos } from '@/components/Videos.jsx';

// No seu App.jsx
<Videos />
```

## 🎨 Personalização

### **Estilos CSS**
Os vídeos usam as classes do Tailwind CSS. Para personalizar:

```css
/* Adicione no seu CSS */
.instagram-media {
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
}

.video-card {
  transition: transform 0.3s ease;
}

.video-card:hover {
  transform: translateY(-4px);
}
```

### **Cores e Temas**
As cores seguem o tema do site:
- **Primary**: Rosa (#e91e63)
- **Accent**: Laranja (#ff9800)
- **Muted**: Cinza claro para backgrounds

## 📱 Responsividade

O sistema é totalmente responsivo:

- **Mobile**: 1 coluna
- **Tablet**: 2 colunas
- **Desktop**: 3 colunas
- **Vídeos em destaque**: 2 colunas em telas médias+

## ⚡ Performance

### **Otimizações Implementadas**
- Lazy loading dos embeds
- Script do Instagram carregado assincronamente
- Memoização de componentes
- Fallback para casos de erro

### **Loading States**
- Skeleton loading durante carregamento
- Animações suaves
- Feedback visual para o usuário

## 🔗 Integração com Redes Sociais

### **WhatsApp**
- Botões para receber dicas por WhatsApp
- Mensagens personalizadas por categoria
- Integração com hook useWhatsApp

### **Instagram**
- Links diretos para o perfil
- Botões "Seguir no Instagram"
- Estatísticas de seguidores

## 🛠️ Ferramentas de Desenvolvimento

### **VideoManager (Apenas Dev)**
Para facilitar o gerenciamento durante o desenvolvimento:

```jsx
import { VideoManager } from '@/components/ui/video-manager.jsx';

// Adicione temporariamente no seu componente
const [showManager, setShowManager] = useState(false);

<VideoManager 
  isVisible={showManager} 
  onClose={() => setShowManager(false)} 
/>
```

**Funcionalidades:**
- Adicionar novos vídeos
- Editar vídeos existentes
- Excluir vídeos
- Exportar dados em JSON

## 📊 Estatísticas e Analytics

### **Métricas Disponíveis**
- Total de vídeos por categoria
- Vídeos mais recentes
- Contagem de seguidores
- Frequência de publicação

### **Funções Utilitárias**
```javascript
import { 
  getRecentVideos, 
  filterVideosByCategory, 
  getVideosByCategory 
} from '@/data/instagram-videos.js';

// Obter vídeos recentes
const recent = getRecentVideos(videos, 4);

// Filtrar por categoria
const filtered = filterVideosByCategory(videos, 'Dicas para pais');

// Contagem por categoria
const counts = getVideosByCategory(videos);
```

## 🚀 Próximos Passos

### **Melhorias Sugeridas**
1. **Sistema de Tags**: Tags mais específicas para busca
2. **Playlist**: Agrupamento de vídeos por tema
3. **Comentários**: Sistema de comentários integrado
4. **Analytics**: Métricas de visualização
5. **Notificações**: Alertas para novos vídeos

### **Integrações Futuras**
- YouTube (vídeos mais longos)
- TikTok (conteúdo adicional)
- Newsletter (envio de dicas por email)

## 🐛 Solução de Problemas

### **Vídeo não carrega**
1. Verificar se a URL do Instagram está correta
2. Confirmar se o post é público
3. Verificar conexão com internet
4. Limpar cache do navegador

### **Erro de script**
1. Verificar se o script do Instagram está carregado
2. Confirmar se não há bloqueadores de script
3. Verificar console do navegador

### **Problemas de responsividade**
1. Verificar classes CSS
2. Testar em diferentes dispositivos
3. Ajustar breakpoints se necessário

## 📞 Suporte

Para dúvidas ou problemas:
- **WhatsApp**: (11) 99999-9999
- **Instagram**: @respirarporjoannabomfim
- **Email**: contato@respirarjoanna.com

---

**Desenvolvido com ❤️ para a Tia Jow**
*Sistema de vídeos integrado ao Instagram* 