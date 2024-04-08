import { useState } from "react";
import { notify } from "../../../components/toast/NotificationIcon";

const useMyTracks = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  // Esta função simplificada verifica a presença de dispositivos de mídia (câmera ou microfone).
  const requestMediaAccess = async (constraints: MediaStreamConstraints): Promise<MediaStream | null> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('API de mídia não suportada');
      notify('API de mídia não suportada', 'Erro', 'close', 'danger');
      return null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream); // Armazena o MediaStream no estado do componente
      return stream;
    } catch (error) {
      // Primeiro, verificamos se o erro é uma instância de Error
      if (error instanceof Error) {
        console.error('Erro ao obter acesso aos dispositivos de mídia:', error);
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          return null;
        } else {
          notify('Permissão para acessar dispositivos de mídia negada ou erro ao acessar os dispositivos', 'Erro', 'close', 'danger');
        }
      } else {
        // Tratamento para erros que não são do tipo Error, se necessário
        notify('Ocorreu um erro desconhecido.', 'Erro', 'close', 'danger');
      }
      return null;
    }
  };


  // Função que usa a função acima para verificar especificamente por câmeras.
  const hasWebcam = async () => {
    return await requestMediaAccess({ video: true }) ? true : false;
  };

  // Função que usa a função acima para verificar especificamente por microfones.
  const hasMicrophone = async () => {
    return await requestMediaAccess({ audio: true }) ? true : false;
  };

  // Função para verificar ambos, câmera e microfone.
  const verifyMediaDevices = async () => {
    const [doHaveMicrophone, doHaveWebcam] = await Promise.all([hasMicrophone(), hasWebcam()]);
    return {
      audio: doHaveMicrophone,
      video: doHaveWebcam,
    };
  };

  return { verifyMediaDevices, mediaStream, hasWebcam, hasMicrophone};
};

export default useMyTracks;
