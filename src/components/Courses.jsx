import { BookOpen, Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Badge } from '@/components/ui/badge.jsx';

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: 'Cuidados Respiratórios em Casa',
      subtitle: 'Para pais e cuidadores',
      description: 'Aprenda técnicas básicas de fisioterapia respiratória para aplicar em casa, identificar sinais de alerta e criar um ambiente favorável à respiração saudável.',
      duration: '4 horas',
      format: 'Online ao vivo',
      participants: 'Máximo 20 pessoas',
      price: 'R$ 197',
      status: 'Próxima turma',
      date: 'Março 2025',
      highlights: [
        'Técnicas de higiene brônquica',
        'Identificação de sinais de alerta',
        'Ambiente respiratório saudável',
        'Exercícios práticos',
        'Certificado de participação'
      ],
      target: 'Pais, mães e cuidadores de crianças'
    },
    {
      id: 2,
      title: 'Fisioterapia Respiratória Pediátrica',
      subtitle: 'Para profissionais da saúde',
      description: 'Curso avançado sobre técnicas especializadas em fisioterapia respiratória infantil, abordagem humanizada e atendimento domiciliar.',
      duration: '8 horas',
      format: 'Presencial',
      participants: 'Máximo 15 pessoas',
      price: 'R$ 497',
      status: 'Em breve',
      date: 'Abril 2025',
      highlights: [
        'Técnicas avançadas de fisioterapia',
        'Abordagem humanizada',
        'Atendimento domiciliar',
        'Casos clínicos práticos',
        'Certificado profissional'
      ],
      target: 'Fisioterapeutas e profissionais da saúde'
    }
  ];

  return (
    <section id="courses" className="section-padding bg-white">
      <div className="container mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="flex items-center justify-center space-x-2 text-primary">
            <BookOpen className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Cursos
            </span>
          </div>
          
          <h2 className="heading-secondary">
            Aprenda com a{' '}
                            <span className="text-primary">Lucas Barbearia</span>
          </h2>
          
          <p className="text-body max-w-2xl mx-auto">
            Cursos especializados em fisioterapia respiratória, tanto para pais e cuidadores 
            quanto para profissionais da saúde que desejam aprimorar seus conhecimentos.
          </p>
        </div>

        {/* Grid de Cursos */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {courses.map((course) => (
            <Card key={course.id} className="border-border hover:shadow-lg transition-shadow">
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-primary">
                      {course.status}
                    </Badge>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{course.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{course.price}</div>
                    <div className="text-sm text-muted-foreground">{course.date}</div>
                  </div>
                </div>
                
                <p className="text-body">{course.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Informações do Curso */}
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{course.format}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{course.participants}</span>
                  </div>
                </div>

                {/* Público-alvo */}
                <div className="bg-secondary/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">Público-alvo:</h4>
                  <p className="text-sm text-muted-foreground">{course.target}</p>
                </div>

                {/* Destaques do Curso */}
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">O que você vai aprender:</h4>
                  <ul className="space-y-2">
                    {course.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 gradient-primary text-white hover:opacity-90"
                    onClick={() => window.open(`https://wa.me/5581999999999?text=Olá! Gostaria de me inscrever no curso "${course.title}".`, '_blank')}
                  >
                    {course.status === 'Em breve' ? 'Pré-inscrição' : 'Inscrever-se'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => window.open(`https://wa.me/5581999999999?text=Olá! Gostaria de mais informações sobre o curso "${course.title}".`, '_blank')}
                  >
                    Mais Informações
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Seja o primeiro a saber sobre novos cursos
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Cadastre-se para receber informações sobre novos cursos, datas de inscrição 
                            e conteúdos exclusivos da Lucas Barbearia.
          </p>
          <Button 
            className="gradient-primary text-white hover:opacity-90"
            onClick={() => window.open('https://wa.me/5581999999999?text=Olá! Gostaria de receber informações sobre novos cursos.', '_blank')}
          >
            Quero ser avisado
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Courses;

