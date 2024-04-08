interface RespondContentTextProps {
  text: string;
  date?: {
    nanoseconds: number;
    seconds: number;
  }
}

const RespondContentText = ({ text, date }: RespondContentTextProps) => {

  const parsedDate = date ? new Date(date.seconds * 1000).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="bg-separator-light d-inline-block rounded-md py-3 px-3 pe-7 position-relative text-alternate" style={{minWidth: '6rem'}}>
      <span className="text">{text}</span>
      <span className="position-absolute text-extra-small text-alternate opacity-75 b-2 e-2 time">{parsedDate}</span>
    </div>
  );
};
export default RespondContentText;
