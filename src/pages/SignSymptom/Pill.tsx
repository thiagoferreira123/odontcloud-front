
interface PillProps {
  children: string;
  level: number;
}

const Pill: React.FC<PillProps> = ({ children, level }) => {
  const getBackgroundColor = (level: number): string => {
    // Determina a cor de fundo com base no nível de evidência
    switch (level) {
      case 1: return '#91d8a6';
      case 2: return '#59c479';
      case 3: return '#54aa6d';
      default: return '#115826';
    }
  };

  return (
    <span style={{
      backgroundColor: getBackgroundColor(level),
      color: 'white',
      padding: '5px 10px',
      borderRadius: '10px',
      marginRight: '5px',
      marginBottom: '5px',
      display: 'inline-block',
    }}>
      {children}
    </span>
  );
};

export default Pill;