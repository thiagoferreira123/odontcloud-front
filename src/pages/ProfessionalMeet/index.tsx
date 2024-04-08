import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Form, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { useAuth } from '../Auth/Login/hook';
import { RemoteAudioTrack, RemoteVideoTrack, Room } from 'twilio-video';
import Video from 'twilio-video';
import { notify } from '../../components/toast/NotificationIcon';
import TwilioVideo from 'twilio-video';
import AsyncButton from '../../components/AsyncButton';
import { useNavigate, useParams } from 'react-router-dom';
import useMyTracks from '../Meet/hooks/MyTracks';
import useTwilioVideo from '../Meet/hooks';
import HtmlHead from '../../components/html-head/HtmlHead';
import { useWebcamPermissionModalStore } from '../Meet/hooks/WebcamPermissionModalStore';
import WebcamPermissionModal from '../Meet/modals/WebcamPermissionModal';

const previewContainerId = 'video-preview';
const audioContainerId = 'audios-container';
const videoContainerId = 'videos-container';

const Meet = () => {
  const title = 'Videochamada';
  const description = 'A basic chat application that built mobile first and has chat and talk screens and contains a contact list.';

  const user = useAuth((state) => state.user);
  const { token } = useParams();

  const copyText = `${location.origin}/meet/${token}`;

  const navigate = useNavigate();

  const { verifyMediaDevices, hasWebcam } = useMyTracks();
  const { connect } = useTwilioVideo(user ? true : false);
  const { showWebcamPermissionModal } = useWebcamPermissionModalStore();

  const [isJoining, setIsJoining] = useState(false);

  const [room, setRoom] = useState<Room | null>(null);

  const [mic, setMic] = useState(true);
  const [screen, setScreen] = useState(false);
  const [screenTrack, setScreenTrack] = useState<Video.LocalVideoTrack | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useState(false);
  const [countParticipants, setCountParticipants] = useState(0);

  const videoRefs = useRef<HTMLMediaElement[]>([]);
  const audioRefs = useRef<HTMLMediaElement[]>([]);

  const getRoom = useCallback(async () => {
    if (room || token === ':token') return;

    setIsJoining(true);

    try {
      setIsLoading(true);
      setIsCameraOn(true);

      const response = await connect(verifyMediaDevices, token);

      if (!response) return setIsLoading(false);

      const connectedRoom = response.connectedRoom;

      if (!response.mediaDevices.audio) setMic(false);
      if (!response.mediaDevices.video) setIsCameraOn(false);

      setCountParticipants(connectedRoom.participants.size ?? 0);

      connectedRoom.localParticipant.videoTracks.forEach((publication) => {
        if (publication.track.kind === 'video') {
          const newVideoElement = publication.track.attach();
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
              videoRefs.current.push(newVideoElement);
              document.getElementById(videoContainerId)?.appendChild(newVideoElement);
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
        setCountParticipants(connectedRoom.participants.size + 1);

        participant.on('trackSubscribed', (track) => {
          if (track.kind === 'video') {
            try {
              const mediaTrack = track as RemoteVideoTrack;

              const newVideoElement = mediaTrack.attach();
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

      connectedRoom.on('participantDisconnected', (participant) => {
        const participants = countParticipants - 1;
        setCountParticipants(participants >= 0 ? participants : 0);

        participant.tracks.forEach((publication) => {
          if (publication.track) {
            if (publication.track.kind === 'video') {
              const id = `participant-${participant.sid}-track-${publication.track.sid}`;
              videoRefs.current = videoRefs.current.filter((video) => video.id !== id);
              document.getElementById(id)?.remove();
            } else if (publication.track.kind === 'audio') {
              const id = `participant-${participant.sid}-audio-track-${publication.track.sid}`;
              audioRefs.current = audioRefs.current.filter((audio) => audio.id !== id);
              document.getElementById(id)?.remove();
            }
          }
        });
      });

      connectedRoom.on('disconnected', () => {
        setCountParticipants(0);
        setRoom(null);
      });

      setIsLoading(false);
      setRoom(connectedRoom);
    } catch (error) {
      console.error(error);
    }
  }, [connect, room, setIsLoading, token, verifyMediaDevices]);

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

  const copyToClipboard = () => {
    // Create a temporary input element
    const copyTextInput = document.createElement('input');
    document.body.appendChild(copyTextInput); // Adiciona ao DOM temporariamente
    copyTextInput.value = copyText;

    // Select the text field
    copyTextInput.select();
    copyTextInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    document.execCommand('copy');

    // Remove the temporary input element from the DOM
    document.body.removeChild(copyTextInput);

    // Notify the user
    notify('Link copiado', 'Sucesso', 'check');
  };

  useEffect(() => {
    token && token.includes('token') && navigate(`/app/ferramentas/meet/${btoa(Math.random().toString())}`);

    !room && !isJoining && getRoom();
  }, [getRoom, isJoining, navigate, room, token]);

  return (
    <>
      <HtmlHead title={title} description={description} />
      <div className="h-100 d-flex flex-column">
        <div className="page-title-container">
          <Row>
            <Col xs="auto" className="mb-2 mb-md-0">
              <div className="sw-md-30 sw-lg-40 w-100">
                <h1 className="mb-0 pb-0 display-4" id="title">
                  {title}
                </h1>
              </div>
            </Col>
            <Col xs="12" className="col-md d-flex align-items-start justify-content-md-end">
              {isMobile && (
                <Button variant="outline-primary" className="btn-icon btn-icon-only ms-1">
                  <CsLineIcons icon="arrow-left" />
                </Button>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <div className="h-100 w-100 d-flex justify-content-center align-items-center">
        <Card className="flex-column container bg-gradient-single-2 position-relative rounded" id="callMode">
          <div className="bg-vertical-ornament-3 w-100 h-100 d-flex flex-column justify-content-between align-items-center sh-80">
            <Card.Body className="d-flex align-items-center flex-column flex-grow-1 w-100 card-body">
              <div className="sw-10 mb-2 position-relative">
                {/* <img src={videoContainerId} className="img-fluid rounded-xl border border-2 border-foreground profile" alt={''} /> */}
              </div>
              <div className="name text-white">{''}</div>
              {/* <div className="text-white text-small time">00:00:00</div> */}
            </Card.Body>

            <Card.Body className="d-flex flex-grow-0 z-1">
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">{isCameraOn ? 'Desabilitar' : 'Habilitar'} câmera</Tooltip>}>
                <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={toggleCamera}>
                  <CsLineIcons icon={isCameraOn ? 'camera' : 'camera-off'} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">{mic ? 'Desabilitar' : 'Habilitar'} microfone</Tooltip>}>
                <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={micToggleClick}>
                  <CsLineIcons icon={mic ? 'mic' : 'mic-off'} />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">{screen ? 'Desabilitar' : 'Habilitar'} compartilhamento de tela</Tooltip>}>
                <Button variant="foreground" className="btn-icon btn-icon-only me-2" onClick={screenSharingToogleClick}>
                  <CsLineIcons icon={screen ? 'stop' : 'screen'} />
                </Button>
              </OverlayTrigger>
              <AsyncButton
                id="leave-videochat-room"
                isSaving={isLoading}
                loadingText={room ? 'saindo...' : 'entrando...'}
                variant="foreground"
                className="btn-icon ps-3 bg-danger text-white active-disabled"
                onClickHandler={endOrLeaveToggleClick}
              >
                <CsLineIcons icon={room ? 'phone-off' : 'phone'} className="me-2" />
                <span>{room ? 'Sair' : 'Entrar'}</span>
              </AsyncButton>
            </Card.Body>

            {!countParticipants ? (
              <Form.Group className="position-absolute top-50 start-50 translate-middle d-flex z-1">
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-filter">Copie o link e envie para o pacien</Tooltip>}>
                  <Button variant="foreground" onClick={copyToClipboard}>
                    <span>Clique para copiar o link da videochamada. </span>
                    <CsLineIcons icon="clipboard" />
                  </Button>
                </OverlayTrigger>
              </Form.Group>
            ) : null}

            <div className="position-absolute w-100 sh-80 overflow-hidden rounded d-flex align-items-center justify-content-center" id="videos-container"></div>
            <div className="position-absolute w-100 sh-80 overflow-hidden rounded" id="audios-container"></div>
            <div className="position-absolute bottom-0 end-0 w-25 h-25 overflow-hidden rounded" id="video-preview"></div>
          </div>
        </Card>
      </div>
      <WebcamPermissionModal />
    </>
  );
};

export default Meet;
