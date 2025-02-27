import React, { useState } from 'react';
import { X } from 'lucide-react';
import Header from '../../components/UserPage/Header';
import Footer from '../../components/UserPage/Footer';

import CV1 from '../../assets/CV/CV1.jpg';
import CV2 from '../../assets/CV/CV2.jpg';
import CV3 from '../../assets/CV/CV3.jpg';
import CV4 from '../../assets/CV/CV4.jpg';
import CV5 from '../../assets/CV/CV5.jpg';
import CV6 from '../../assets/CV/CV6.jpg';
import CV7 from '../../assets/CV/CV7.jpg';
import CV8 from '../../assets/CV/CV8.jpg';

const CreateCV = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: 1,
      title: 'CV Mẫu 1',
      image: CV1,
      canvaUrl: 'https://www.canva.com/templates/EAFlgpNIE60-white-simple-sales-representative-cv-resume/'
    },
    {
      id: 2,
      title: 'CV Mẫu 2',
      image: CV2,
      canvaUrl: 'https://www.canva.com/templates/EAGQUnFrIZI-science-and-engineering-resume-in-white-black-simple-style/'
    },
    {
      id: 3,
      title: 'CV Mẫu 3',
      image: CV3,
      canvaUrl: 'https://www.canva.com/templates/EAGQgTF7iHw-marketing-and-sales-resume-in-grey-black-simple-style/'
    },
    {
      id: 4,
      title: 'CV Mẫu 4',
      image: CV4,
      canvaUrl: 'https://www.canva.com/fr_fr/modeles/EAF4v3vSWqE-beige-et-rose-simple-cv-professionnel-cv/'
    },
    {
      id: 5,
      title: 'CV Mẫu 5',
      image: CV5,
      canvaUrl: 'https://www.canva.com/templates/EAGQu2wxaAo-simple-professional-cv-resume/'
    },
    {
      id: 6,
      title: 'CV Mẫu 6',
      image: CV6,
      canvaUrl: 'https://www.canva.com/templates/EAGP2_4tAXM-professional-modern-cv-resume/'
    },
    {
      id: 7,
      title: 'CV Mẫu 7',
      image: CV7,
      canvaUrl: 'https://www.canva.com/templates/EAGQ7qQaVuE-simple-professional-cv-resume/'
    },
    {
      id: 8,
      title: 'CV Mẫu 8',
      image: CV8,
      canvaUrl: 'https://www.canva.com/templates/EAFuy_EwAJs-professional-minimalist-cv-resume/'
    },
  ];

  const handleUseTemplate = (canvaUrl) => {
    window.open(canvaUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-screen-xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 drop-shadow">
              Chọn Mẫu CV Chuyên Nghiệp
            </h1>

            <div className="mb-8">
              <p className="text-center text-gray-600 max-w-2xl mx-auto">
                Chọn từ bộ sưu tập mẫu CV được thiết kế chuyên nghiệp của chúng tôi.<br />
                Mỗi mẫu đều được tối ưu hóa để thu hút sự chú ý của nhà tuyển dụng.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="relative group bg-white rounded-xl h-[360px] shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-w-3 aspect-h-4">
                    <img
                      src={template.image}
                      alt={template.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold mb-3">{template.title}</h3>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedTemplate(template)}
                          className="flex-1 px-4 py-2 bg-[#2b65a5] text-white rounded-lg hover:bg-[#245485] transition-colors"
                        >
                          Xem mẫu
                        </button>
                        <button
                          onClick={() => handleUseTemplate(template.canvaUrl)}
                          className="flex-1 px-4 py-2 bg-[#009345] text-white rounded-lg hover:bg-[#007a3a] transition-colors"
                        >
                          Sử dụng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {selectedTemplate && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[9999]" onClick={() => setSelectedTemplate(null)} />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999] pointer-events-none">
            <div className="relative bg-white rounded-xl w-full max-w-lg max-h-[90vh] shadow-2xl pointer-events-auto">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{selectedTemplate.title}</h2>
                <div className="flex justify-center">
                  <img
                    src={selectedTemplate.image}
                    alt={selectedTemplate.title}
                    className="max-w-[400px] h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default CreateCV;