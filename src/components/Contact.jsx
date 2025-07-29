import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contato" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Entre em <span className="text-gray-600">Contato</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Estamos aqui para ajudar você. Entre em contato conosco através dos canais abaixo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Informações de Contato */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Endereço</h3>
                  <p className="text-gray-600">Rua das Flores, 123 - Centro</p>
                  <p className="text-gray-600">São Paulo - SP, 01234-567</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Telefone</h3>
                  <p className="text-gray-600">(11) 99999-9999</p>
                  <p className="text-gray-600">WhatsApp disponível</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">Horário de Funcionamento</h3>
                  <p className="text-gray-600">Segunda a Sábado: 9h às 19h</p>
                  <p className="text-gray-600">Domingo: 9h às 18h</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-black">E-mail</h3>
                  <p className="text-gray-600">contato@lucasbarbearia.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA para WhatsApp */}
          <div className="text-center bg-gray-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-black mb-4">
              Precisa de ajuda?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Entre em contato conosco pelo WhatsApp para tirar dúvidas ou obter mais informações sobre nossos serviços.
            </p>
            <button 
              className="bg-green-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-green-700 transition-colors"
              onClick={() => {
                window.open('https://wa.me/5511999999999?text=Olá! Gostaria de falar com a Lucas Barbearia.', '_blank');
              }}
            >
              Falar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

