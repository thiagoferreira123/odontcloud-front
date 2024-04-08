import { useState } from 'react';
import { MessageType } from '../../../services/useFirebase';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

interface MessageContentAttachmentProps {
  content: string;
  message_type: MessageType;
  date: {
    nanoseconds: number;
    seconds: number;
  };
}

const MessageContentAttachment = ({ content, date, message_type }: MessageContentAttachmentProps) => {
  const [showDownloadIcon, setShowDownloadIcon] = useState(false);

  const parsedDate = new Date(date.seconds * 1000).toLocaleString();

  if (content && message_type) {
    message_type = message_type.includes('image') ? ('image' as MessageType) : message_type;

    switch (message_type) {
      case 'image':
        return (
          <>
            <div className="d-inline-block ms-2 position-relative pb-4 bg-primary rounded-md">
              <a href={content} target="_blank" rel="noreferrer" download className="lightbox h-100 attachment cursor-pointer">
                <img src={content} className="img-fluid sw-50 rounded-md-top" alt={content} />
              </a>
              <span className="position-absolute text-extra-small text-white opacity-75 b-2 s-2 time">{parsedDate}</span>
            </div>
          </>
        );
      default:
        return (
          <>
            <div className="d-inline-block ms-2 position-relative pb-4 bg-primary rounded-md">
              <a
                href={content}
                target="_blank"
                download
                className="lightbox h-100 attachment cursor-pointer sw-15 sh-5 d-flex justify-content-center align-items-center text-light"
                rel="noreferrer"
                onMouseOver={() => setShowDownloadIcon(true)}
                onFocus={() => setShowDownloadIcon(true)}
                onMouseLeave={() => setShowDownloadIcon(false)}
                onBlur={() => setShowDownloadIcon(false)}
              >
                {showDownloadIcon ? <CsLineIcons icon="download" /> : <CsLineIcons icon="file-text" />}
              </a>
              <span className="position-absolute text-extra-small text-white opacity-75 b-2 s-2 time">{parsedDate}</span>
            </div>
          </>
        );
    }
  }
  return <></>;
};
export default MessageContentAttachment;
