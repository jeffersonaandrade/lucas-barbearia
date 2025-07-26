import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Alert, AlertDescription } from '@/components/ui/alert.jsx';
import { Calendar } from '@/components/ui/calendar.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { barbeariasService } from '@/services/api.js';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Users, 
  Scissors,
  Calendar as CalendarIcon,
  ArrowLeft,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  Clock3
} from 'lucide-react';

const AppointmentScheduler = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barbearia, setBarbearia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  useEffect(() => {
    const carregarBarbearia = async () => {
      try {
        const response = await barbeariasService.obterBarbearia(id);
        setBarbearia(response.data);
      } catch (error) {
        console.error('Erro ao carregar barbearia:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarBarbearia();
  }, [id]);

  useEffect(() => {
    if (selectedDate && barbearia) {
      // Gerar horários disponíveis baseado no horário de funcionamento
      const horarios = gerarHorariosDisponiveis(selectedDate, barbearia);
      setAvailableTimes(horarios);
    }
  }, [selectedDate, barbearia]);

  const gerarHorariosDisponiveis = (date, barbearia) => {
    const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const horarios = [];
    
    // Mapear dia da semana para configuração
    const diasSemana = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    const diaConfig = barbearia.horario[diasSemana[dayOfWeek]];
    
    if (diaConfig && diaConfig.aberto) {
      const inicio = new Date(`2000-01-01 ${diaConfig.inicio}`);
      const fim = new Date(`2000-01-01 ${diaConfig.fim}`);
      
      // Gerar horários a cada 30 minutos
      let currentTime = new Date(inicio);
      while (currentTime < fim) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        horarios.push(timeString);
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    }
    
    return horarios;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || !selectedBarbeiro || !clientName || !clientPhone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Aqui você implementaria a lógica para salvar o agendamento
      const agendamento = {
        barbeariaId: id,
        cliente: {
          nome: clientName,
          telefone: clientPhone
        },
        servico: selectedService,
        barbeiro: selectedBarbeiro,
        data: selectedDate.toISOString().split('T')[0],
        horario: selectedTime,
        status: 'agendado'
      };

      console.log('Agendamento:', agendamento);
      
      // Simular sucesso
      alert('Agendamento realizado com sucesso!');
      navigate(`/barbearia/${id}/agendamento-confirmado`);
    } catch (error) {
      console.error('Erro ao realizar agendamento:', error);
      alert('Erro ao realizar agendamento. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações...</p>
        </div>
      </div>
    );
  }

  if (!barbearia) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Barbearia não encontrada.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/barbearia/${id}`)}
            className="text-primary hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Barbearia
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendar Horário - {barbearia.nome}
          </h1>
          <p className="text-gray-600">
            Escolha a data, horário e serviço desejado
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Informações da Barbearia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scissors className="w-5 h-5 text-primary" />
                <span>Informações da Unidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{barbearia.endereco}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{barbearia.telefone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  Segunda a Sexta: {barbearia.horario.segunda.aberto ? 
                    `${barbearia.horario.segunda.inicio} - ${barbearia.horario.segunda.fim}` : 
                    'Fechado'
                  }
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {barbearia.barbeiros && barbearia.barbeiros.length > 0 ? `${barbearia.barbeiros.length} barbeiros` : 'Nenhum barbeiro disponível'}
                </span>
              </div>

              {/* Serviços */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Serviços Disponíveis:</h4>
                <div className="space-y-1">
                  {barbearia.servicos.map((servico, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">{servico.nome}</span>
                      <span className="font-semibold text-primary">{servico.preco}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Agendamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span>Agendar Horário</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {/* Dados do Cliente */}
                <div className="space-y-3 lg:space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Dados do Cliente
                  </h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      placeholder="(81) 99999-9999"
                      required
                    />
                  </div>
                </div>

                {/* Seleção de Data */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione a Data *
                  </label>
                  <div className="flex justify-center w-full">
                    <div className="w-full max-w-sm">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border bg-white w-full"
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Seleção de Horário */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione o Horário *
                    </label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Escolha um horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimes.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center space-x-2">
                              <Clock3 className="w-4 h-4" />
                              <span>{time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Seleção de Serviço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione o Serviço *
                  </label>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Escolha um serviço" />
                    </SelectTrigger>
                    <SelectContent>
                      {barbearia.servicos.map((servico, index) => (
                        <SelectItem key={index} value={servico.nome}>
                          <div className="flex items-center justify-between w-full">
                            <span>{servico.nome}</span>
                            <Badge variant="outline" className="ml-2">
                              {servico.preco}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Barbeiro */}
                {barbearia.barbeiros && barbearia.barbeiros.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione o Barbeiro *
                    </label>
                    <Select value={selectedBarbeiro} onValueChange={setSelectedBarbeiro}>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Escolha um barbeiro" />
                      </SelectTrigger>
                      <SelectContent>
                        {barbearia.barbeiros.map((barbeiro, index) => (
                          <SelectItem key={index} value={barbeiro.nome}>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span>{barbeiro.nome}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Botão de Agendamento */}
                <Button 
                  type="submit" 
                  className="w-full py-3 text-sm lg:text-base"
                  disabled={!selectedDate || !selectedTime || !selectedService || !selectedBarbeiro || !clientName || !clientPhone}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirmar Agendamento
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informações Adicionais */}
        <Card className="mt-6 lg:mt-8">
          <CardContent className="pt-4 lg:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Agendamento Online</h4>
                <p className="text-sm text-gray-600">Reserve seu horário com antecedência</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Confirmação Imediata</h4>
                <p className="text-sm text-gray-600">Receba confirmação por WhatsApp</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Qualidade Garantida</h4>
                <p className="text-sm text-gray-600">Profissionais experientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppointmentScheduler; 