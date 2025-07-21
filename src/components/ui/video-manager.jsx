import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { instagramVideos, videoCategories } from '@/data/instagram-videos.js';

// Componente para gerenciar vídeos (apenas para desenvolvimento)
const VideoManager = ({ isVisible = false, onClose }) => {
  const [videos, setVideos] = useState(instagramVideos);
  const [editingVideo, setEditingVideo] = useState(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    postUrl: '',
    category: 'Dicas para pais',
    publishedAt: new Date().toISOString().split('T')[0]
  });

  const handleAddVideo = () => {
    if (!newVideo.title || !newVideo.description || !newVideo.postUrl) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const video = {
      id: videos.length + 1,
      ...newVideo
    };

    setVideos([...videos, video]);
    setNewVideo({
      title: '',
      description: '',
      postUrl: '',
      category: 'Dicas para pais',
      publishedAt: new Date().toISOString().split('T')[0]
    });
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
  };

  const handleSaveEdit = () => {
    if (!editingVideo.title || !editingVideo.description || !editingVideo.postUrl) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setVideos(videos.map(v => v.id === editingVideo.id ? editingVideo : v));
    setEditingVideo(null);
  };

  const handleDeleteVideo = (id) => {
    if (confirm('Tem certeza que deseja excluir este vídeo?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const exportVideos = () => {
    const dataStr = JSON.stringify(videos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instagram-videos.json';
    link.click();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Gerenciador de Vídeos do Instagram</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Adicionar Novo Vídeo */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Adicionar Novo Vídeo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Título do vídeo"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                />
                <Input
                  placeholder="URL do post do Instagram"
                  value={newVideo.postUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, postUrl: e.target.value })}
                />
                <Select value={newVideo.category} onValueChange={(value) => setNewVideo({ ...newVideo, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoCategories.filter(cat => cat !== 'Todos').map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  value={newVideo.publishedAt}
                  onChange={(e) => setNewVideo({ ...newVideo, publishedAt: e.target.value })}
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="Descrição do vídeo"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleAddVideo} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Vídeo
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Vídeos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Vídeos ({videos.length})</h3>
              <Button variant="outline" onClick={exportVideos}>
                Exportar JSON
              </Button>
            </div>
            
            {videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="p-4">
                  {editingVideo?.id === video.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingVideo.title}
                        onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                      />
                      <Input
                        value={editingVideo.postUrl}
                        onChange={(e) => setEditingVideo({ ...editingVideo, postUrl: e.target.value })}
                      />
                      <Select value={editingVideo.category} onValueChange={(value) => setEditingVideo({ ...editingVideo, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {videoCategories.filter(cat => cat !== 'Todos').map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={editingVideo.description}
                        onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveEdit}>
                          <Save className="w-4 h-4 mr-1" />
                          Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingVideo(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{video.category}</span>
                          <span>{video.publishedAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditVideo(video)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteVideo(video.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { VideoManager }; 