interface MessageContentTextProps {
  text: string;
  date: {
    nanoseconds: number;
    seconds: number;
  }
}

const MessageContentText = ({ text, date }: MessageContentTextProps) => {

  const parsedDate = new Date(date.seconds * 1000).toLocaleString();

  return (
    <div className="bg-gradient-light d-inline-block rounded-md py-3 px-3 ps-2 text-white position-relative" style={{minWidth: '8rem'}}>
      <span className="text">{text}</span>
      <span className="position-absolute text-extra-small text-white opacity-75 b-2 s-2 time">{parsedDate}</span>
    </div>
  );
};
export default MessageContentText;
