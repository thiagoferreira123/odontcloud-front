import { useEffect, useState } from 'react';
import TwilioVideo, { Room } from 'twilio-video';
import api from '../../../services/useAxios';

function useTwilioVideo(isProfessional: boolean) {
  const [room, setRoom] = useState<TwilioVideo.Room | null>(null);

  const connectToRoom = async (
    verifyMediaDevices: () => Promise<{ audio: boolean; video: boolean }>,
    token: string | undefined
  ): Promise<{ connectedRoom: Room; token: string; mediaDevices: { audio: boolean; video: boolean } } | false> => {
    try {
      if (room) {
        room.disconnect();
      }

      if (!token) throw new Error('Invalid token');

      const { data } = await api.get<string>(isProfessional ? '/twilio/professional/' + token : '/twilio/' + token);

      const mediaDevices = await verifyMediaDevices();

      const localTracks = await TwilioVideo.createLocalTracks(mediaDevices);
      const connectedRoom = await TwilioVideo.connect(data, {
        name: token,
        tracks: localTracks,
      });

      room &&
        room.on('disconnected', (room) => {
          room.localParticipant.tracks.forEach((publication) => {
            if (publication.track) {
              publication.track.removeAllListeners();
            }
          });
        });

      setRoom(connectedRoom);

      return { connectedRoom, token: data, mediaDevices };
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  useEffect(() => {
    return () => {
      room && room.disconnect();
    };
  }, [room]);

  return {
    connect: connectToRoom,
    disconnect: () => room?.disconnect(),
    room,
  };
}

export default useTwilioVideo;
