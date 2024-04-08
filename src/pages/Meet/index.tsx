import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import useLayout from '../../hooks/useLayout';
import useMyTracks from './hooks/MyTracks';
import useTwilioVideo from './hooks';
import { useAuth } from '../Auth/Login/hook';
import { RemoteAudioTrack, RemoteVideoTrack, Room } from 'twilio-video';
import Video from 'twilio-video';
import { notify } from '../../components/toast/NotificationIcon';
import TwilioVideo from 'twilio-video';
import AsyncButton from '../../components/AsyncButton';
import { useParams } from 'react-router-dom';
import { useWebcamPermissionModalStore } from './hooks/WebcamPermissionModalStore';
import WebcamPermissionModal from './modals/WebcamPermissionModal';

const previewContainerId = 'video-preview';
const audioContainerId = 'audios-container';
const videoContainerId = 'videos-container';

const Meet = () => {
  useLayout();

  const user = useAuth((state) => state.user);
  const { token } = useParams();

  const { verifyMediaDevices, hasWebcam } = useMyTracks();
  const { connect } = useTwilioVideo(user ? true : false);
  const { showWebcamPermissionModal } = useWebcamPermissionModalStore();

  const [isLoading, setIsLoading] = useState(false);

  const [room, setRoom] = useState<Room | null>(null);

  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState<Video.LocalVideoTrack | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isJoining, setIsJoining] = useState(false);

  const videoRefs = useRef<HTMLMediaElement[]>([]);
  const audioRefs = useRef<HTMLMediaElement[]>([]);

  const getRoom = useCallback(async () => {
    if (room) return;

    setIsJoining(true);

    try {
      setIsLoading(true);
      setIsCameraOn(true);

      const response = await connect(verifyMediaDevices, token);

      if (!response) return setIsLoading(false);

      const connectedRoom = response.connectedRoom;

      if (!response.mediaDevices.audio) setMic(false);
      if (!response.mediaDevices.video) setIsCameraOn(false);

      connectedRoom.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track.kind === 'video') {
          const newVideoElement = publication.track.attach();
          newVideoElement.classList.add('rounded')

          document.getElementById(previewContainerId)?.appendChild(newVideoElement);
          return;
        }
      });

      connectedRoom.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed && publication.track) {
            const track = publication.track;
            if (track.kind === 'video') {
              const newVideoElement = track.attach();
              newVideoElement.classList.add('rounded')
              videoRefs.current.push(newVideoElement);
              document.getElementById(videoContainerId)?.prepend(newVideoElement);
            } else if (track.kind === 'audio') {
              const newAudioElement = track.attach();
              audioRefs.current.push(newAudioElement);
              document.getElementById(audioContainerId)?.appendChild(newAudioElement);
            }
          }
        });

        participant.on('trackSubscribed', (track) => {
          if (track.kind === 'video') {
            const newVideoElement = track.attach();
            newVideoElement.classList.add('rounded')
            videoRefs.current.push(newVideoElement);
            document.getElementById(videoContainerId)?.prepend(newVideoElement);
          } else if (track.kind === 'audio') {
            const newAudioElement = track.attach();
            audioRefs.current.push(newAudioElement);
            document.getElementById(audioContainerId)?.appendChild(newAudioElement);
          }
        });

        participant.on('trackUnsubscribed', (track) => {
          if (track.kind === 'video' || track.kind === 'audio') {
            try {
              const elements = track.detach();
              elements.forEach((element) => element.remove());
            } catch (error) {
              console.error(error);
            }
          }
        });

        participant.on('trackDisabled', (track) => {
          try {
            if (!track.track) throw new Error('Track not found');

            if (track.track.kind === 'video' || track.track.kind === 'audio') {
              const elements = track.track?.detach();
              elements.forEach((element) => element.remove());
            }
          } catch (error) {
            console.error(error);
          }
        });
      });

      connectedRoom.on('participantConnected', (participant) => {
        participant.on('trackSubscribed', (track) => {
          if (track.kind === 'video') {
            try {
              const mediaTrack = track as RemoteVideoTrack;

              const newVideoElement = mediaTrack.attach();
              newVideoElement.classList.add('rounded')
              newVideoElement.id = `participant-${participant.sid}-track-${track.sid}`;

              videoRefs.current.push(newVideoElement);

              const videoContainer = document.getElementById(videoContainerId);
              videoContainer?.prepend(newVideoElement);
            } catch (error) {
              console.error(error);
            }
          } else if (track.kind === 'audio') {
            const audioTrack = track as RemoteAudioTrack;

            const newAudioElement = audioTrack.attach();
            newAudioElement.id = `participant-${participant.sid}-audio-track-${track.sid}`;

            audioRefs.current.push(newAudioElement);

            const audioContainer = document.getElementById(audioContainerId);
            audioContainer?.appendChild(newAudioElement);
          }
        });

        participant.on('trackUnsubscribed', (track) => {
          if (track.kind === 'video') {
            try {
              const id = `participant-${participant.sid}-track-${track.sid}`;

              videoRefs.current = videoRefs.current.filter((video) => video.id !== id);

              document.getElementById(id)?.remove();
            } catch (error) {
              console.error(error);
            }
          }
        });

        participant.on('trackDisabled', (track) => {
          if (track.kind === 'video') {
            try {
              if (!track.track?.sid) return console.error('Track not found');

              const id = `participant-${participant.sid}-track-${track.track.sid}`;

              videoRefs.current = videoRefs.current.filter((video) => video.id !== id);

              document.getElementById(id)?.remove();
            } catch (error) {
              console.error(error);
            }
          }
        });
      });

      connectedRoom.on('disconnected', () => {
        setRoom(null);
      });

      setIsLoading(false);
      setRoom(connectedRoom);
    } catch (error) {
      console.error(error);
    }
  }, [connect, room, token, verifyMediaDevices]);

  const toggleCamera = async () => {
    if (!room) return;

    const webcamEnabled = await hasWebcam();
    if (!webcamEnabled) return showWebcamPermissionModal();

    document.getElementById(previewContainerId)?.childNodes.forEach((e) => e.remove());

    if (isCameraOn) {
      // Desligar câmera
      disableVideoTrack();
      setIsCameraOn(false);
    } else {
      // Ligar câmera
      try {
        disableVideoTrack();

        const newTrack = await TwilioVideo.createLocalVideoTrack();
        const newVideoElement = newTrack.attach();
        newVideoElement.classList.add('rounded')
        document.getElementById(previewContainerId)?.prepend(newVideoElement);

        await room.localParticipant.publishTrack(newTrack);
        setIsCameraOn(true);
      } catch (error) {
        console.error('Erro ao publicar faixa de vídeo:', error);
        notify('Erro ao ligar câmera', 'Erro', 'close', 'danger');
      }
    }
  };

  const micToggleClick = () => {
    if (!room) return;

    try {
      if (!room.localParticipant.audioTracks.size) throw new Error('No audio tracks were found');

      room.localParticipant.audioTracks.forEach((publication) => {
        if (mic) {
          publication.track.disable();
        } else {
          publication.track.enable();
        }
      });
      setMic(!mic);
    } catch (error) {
      console.error('Erro ao publicar faixa de áudio:', error);
      notify('Erro ao ligar microfone', 'Erro', 'close', 'danger');
    }
  };

  const screenSharingToogleClick = async () => {
    if (!room) return console.error('room is not defined');

    document.getElementById(previewContainerId)?.childNodes.forEach((e) => e.remove());
    disableVideoTrack();

    if (screen) {
      if (screenTrack) {
        screenTrack.detach().forEach((element) => {
          element.remove();
        });
        screenTrack.stop();
        screenTrack.disable();
      }

      setScreenTrack(null);

      if (isCameraOn) {
        const newTrack = await TwilioVideo.createLocalVideoTrack();
        const newVideoElement = newTrack.attach();
        newVideoElement.classList.add('rounded')
        document.getElementById(previewContainerId)?.prepend(newVideoElement);

        await room.localParticipant.publishTrack(newTrack);
        setIsCameraOn(true);
      }

      setScreen(false);
    } else {
      navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => {
          const screen = new TwilioVideo.LocalVideoTrack(stream.getTracks()[0]);
          setScreenTrack(screen);

          screen && room.localParticipant.publishTrack(screen);

          if (screen)
            screen.mediaStreamTrack.onended = async () => {
              screen.detach().forEach((element) => {
                element.remove();
              });

              screen.stop();
              screen.disable();
              room.localParticipant.unpublishTrack(screen);

              const newTrack = await TwilioVideo.createLocalVideoTrack();
              await room.localParticipant.publishTrack(newTrack);
              setIsCameraOn(true);
              setScreen(false);
            };
          else console.error('Error creating local video track');

          const newVideoElement = screen.attach();
          newVideoElement.classList.add('rounded')
          document.getElementById(previewContainerId)?.prepend(newVideoElement);

          setIsCameraOn(false);
          setScreen(true);
        })
        .catch((error) => {
          if (error.message.includes('Permission')) return;

          setScreen(false);
          setScreenTrack(null);
          console.error(error);
          notify('Erro ao tentar compartilhar tela com o paciente', 'Erro', 'close', 'danger');
        });
    }
  };

  const disableVideoTrack = () => {
    room &&
      room.localParticipant.videoTracks.forEach(async (publication) => {
        publication.track.disable();
        publication.track.stop();
        publication.unpublish();
      });

    setScreen(false);
    document.getElementById(previewContainerId)?.childNodes.forEach((e) => e.remove());
  };

  const disableAudioTrack = () => {
    room &&
      room.localParticipant.audioTracks.forEach((publication) => {
        publication.track.disable();
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
        document.getElementById(audioContainerId)?.childNodes.forEach((e) => e.remove());
      });
  };

  const endOrLeaveToggleClick = () => {
    if (room) {
      disableVideoTrack();
      disableAudioTrack();
      room.disconnect();
      setRoom(null);

      videoRefs.current = [];
      audioRefs.current = [];
      document.getElementById(videoContainerId)?.childNodes.forEach((e) => e.remove());
      document.getElementById(audioContainerId)?.childNodes.forEach((e) => e.remove());
      document.getElementById(previewContainerId)?.childNodes.forEach((e) => e.remove());
    } else {
      getRoom();
    }
  };

  useEffect(() => {
    !room && !isJoining && getRoom();
  }, [getRoom, isJoining, room]);

  return (
    <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
      <Card className="flex-column container bg-gradient-single-2 position-relative rounded" id="callMode">
        <div className="bg-vertical-ornament-3 w-100 h-100 d-flex flex-column justify-content-between align-items-center sh-80">
          <Card.Body className="d-flex align-items-center flex-column flex-grow-1 w-100 z-1">
            <div className="sw-10 mb-2 position-relative">
              {/* <img src={videoContainerId} className="img-fluid rounded-xl border border-2 border-foreground profile" alt={''} /> */}
            </div>
            <div className="name text-white">{''}</div>
            {/* <div className="text-white text-small time">00:00:00</div> */}
          </Card.Body>

          <Card.Body className="d-flex flex-grow-0 z-1">
            <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={toggleCamera}>
              <CsLineIcons icon={isCameraOn ? 'camera' : 'camera-off'} />
            </Button>
            <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={micToggleClick}>
              <CsLineIcons icon={mic ? 'mic' : 'mic-off'} />
            </Button>
            <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={screenSharingToogleClick}>
              <CsLineIcons icon={screen ? 'stop' : 'screen'} />
            </Button>
            <AsyncButton
              isSaving={isLoading}
              loadingText={room ? 'saindo...' : 'entrando...'}
              variant="foreground"
              className="btn-icon ps-3"
              onClickHandler={endOrLeaveToggleClick}
            >
              <CsLineIcons icon={room ? 'phone-off' : 'phone'} className="me-2" />
              <span>{room ? 'Sair' : 'Entrar'}</span>
            </AsyncButton>
          </Card.Body>

          <div className="position-absolute w-100 sh-80 overflow-hidden rounded d-flex align-items-center justify-content-center" id="videos-container"></div>
          <div className="position-absolute w-100 sh-80 overflow-hidden rounded" id="audios-container"></div>
          <div className="position-absolute bottom-0 end-0 w-25 h-25 overflow-hidden d-flex align-items-center justify-content-center pb-5 mb-3" id="video-preview"></div>
        </div>
      </Card>

      <WebcamPermissionModal />
    </div>
  );
};
export default Meet;
