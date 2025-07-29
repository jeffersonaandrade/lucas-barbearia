import { Phone, MapPin, Clock, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Coluna 1 - Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">L</span>
              </div>
              <span className="text-xl font-bold text-white">LUCAS BARBEARIA</span>
            </div>
            <p className="text-gray-300 max-w-sm">
              Profissionalismo e qualidade em cada corte. Atendimento personalizado 
              com as melhores técnicas e produtos do mercado.
            </p>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Links Rápidos</h3>
            <nav className="space-y-2">
              <a href="#home" className="block text-gray-300 hover:text-white transition-colors">
                Início
              </a>
              <a href="#barbearias" className="block text-gray-300 hover:text-white transition-colors">
                Barbearias
              </a>
              <a href="#servicos" className="block text-gray-300 hover:text-white transition-colors">
                Serviços
              </a>
              <a href="#galeria" className="block text-gray-300 hover:text-white transition-colors">
                Galeria
              </a>
              <a href="#contato" className="block text-gray-300 hover:text-white transition-colors">
                Contato
              </a>
            </nav>
          </div>

          {/* Coluna 3 - Contato */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contato</h3>
            <div className="space-y-3">
              <a
                href="tel:81999999999"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">(81) 99999-9999</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Rua das Barbearias, 123 - Recife/PE</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Seg-Sáb: 8h às 20h | Dom: 9h às 18h</span>
              </div>
              <a
                href="mailto:contato@lucasbarbearia.com"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">contato@lucasbarbearia.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Seção de Informações Importantes */}
        <div className="grid md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-700">
          <div className="bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-white mb-2">
              Atendimento aos Fins de Semana
            </h4>
            <p className="text-sm text-gray-300">
              Sábados e domingos com horário especial. Agende seu horário preferido 
              através do WhatsApp ou sistema online.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h4 className="font-semibold text-white mb-2">
              Agendamento Online
            </h4>
            <p className="text-sm text-gray-300">
              Agende seu horário de forma rápida e prática através do nosso 
              sistema online. Evite filas e garanta seu horário.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-300">
              © {currentYear} Lucas Barbearia. Todos os direitos reservados.
            </div>
            <div className="text-sm text-gray-300">
              Desenvolvido por{' '}
              <a 
                href="https://github.com/jeffersonandrade" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
              >
                Jefferson Andrade
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

