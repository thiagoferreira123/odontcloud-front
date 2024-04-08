import { Card } from 'react-bootstrap';
import Glide from '../../components/carousel/Glide';

type AvatarDropzoneProps = {
  formik: {
    handleChange: {
      (e: React.ChangeEvent<any>): void;
      <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };

    setFieldValue: (field: string, value: string, shouldValidate?: boolean | undefined) => void;
  };
  value: string;
};

const SelectBackgroundImage = ({ formik, value }: AvatarDropzoneProps) => {
  const { setFieldValue } = formik;

  return (
    <Glide>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
        <Glide.Item key={`basic.${i}`}>
          <Card as="label" className={`mb-3 position-static pointer ${value === `/img/backgrounds-website/${i}.webp` ? 'border border-danger' : ''}`} htmlFor={`checkbox.${i}`}>
            <Card.Img variant="top" src={`/img/backgrounds-website/${i}.webp`} alt="card image" />
            <Card.Body className="position-relative">
              <input
                className="form-check-input d-none"
                name="backgroundImage"
                type="radio"
                value=""
                id={`checkbox.${i}`}
                onChange={(e) => setFieldValue('backgroundImage', `/img/backgrounds-website/${i}.webp`)}
              />
            </Card.Body>
          </Card>
        </Glide.Item>
      ))}
    </Glide>
  );
};

export default SelectBackgroundImage;
