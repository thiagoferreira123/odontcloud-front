import { useEffect, useState } from 'react';
import { Alert, Button, Card, Form, FormControl, InputGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ColorResult, SliderPicker } from 'react-color';
import AvatarDropzone from './AvatarDropzone';
import SelectBackgroundImage from './SelectBackgroundImage';
import ServiceRow, { ProfessionalWebsiteService } from './ServiceRow';
import * as Icon from 'react-bootstrap-icons';
import SpecialityRow, { ProfessionalWebsiteSpeciality } from './SpecialityRow';
import AsyncButton from '../../components/AsyncButton';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useProfessionalSiteStore from './hooks';
import { AppException } from '../../helpers/ErrorHelpers';
import { notify } from '../../components/toast/NotificationIcon';
import StaticLoading from '../../components/loading/StaticLoading';
import { useNavigate } from 'react-router-dom';

export interface ProfessionalWebsiteFormValues {
  professionalPhotoLink: string;
  backgroundImage: string;
  presentation: string;
  aboutMe: string;
  impactPhrase: string;
  services: ProfessionalWebsiteService[];
  specialities: ProfessionalWebsiteSpeciality[];
  websiteUrl: string;
  websiteColor: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
}

export default function ProfessionalWebsite() {
  const title = 'Construtor de Sites';

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    professionalPhotoLink: Yup.string().required('Insira uma foto de perfil'),
    backgroundImage: Yup.string().required('Selecione uma imagem de fundo'),
    presentation: Yup.string().required('Insira um nome e CRN'),
    aboutMe: Yup.string().required('Insira uma descrição sobre você'),
    impactPhrase: Yup.string().required('Insira uma frase de impacto'),
    services: Yup.array().of(
      Yup.object().shape({
        serviceName: Yup.string().required('Insira um nome para o serviço'),
        serviceDescription: Yup.string().required('Insira uma descrição para o serviço'),
      })
    ),
    specialities: Yup.array().of(
      Yup.object().shape({
        specialityName: Yup.string().required('Insira um nome para a especialidade'),
        specialityDescription: Yup.string().required('Insira uma descrição para a especialidade'),
      })
    ),
    websiteUrl: Yup.string()
      .matches(/^[A-Za-z]+$/, 'Digite um link valido (deve conter apenas letras)')
      .required('Digite um link valido (deve conter apenas letras)'),
    websiteColor: Yup.string().required('Selecione uma cor para o Website'),
    facebook: Yup.string(),
    instagram: Yup.string(),
    linkedin: Yup.string(),
    twitter: Yup.string(),
    youtube: Yup.string(),
    whatsapp: Yup.string(),
  });

  const handleChangeSliderPicker = (websiteColor: ColorResult) => {
    setColor(websiteColor.hex); // Atualiza o estado com a nova cor selecionada
    setFieldValue('websiteColor', websiteColor.hex);
  };

  const [websiteColor, setColor] = useState('#FFFFFF');
  const [isSaving, setIsSaving] = useState(false);

  const initialValues: ProfessionalWebsiteFormValues = {
    websiteUrl: '',
    presentation: '',
    impactPhrase: '',
    aboutMe: '',
    services: [
      {
        serviceName: '',
        serviceDescription: '',
      },
    ],
    specialities: [
      {
        specialityName: '',
        specialityDescription: '',
      },
    ],
    websiteColor: '#2f55d4',
    professionalPhotoLink: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    twitter: '',
    youtube: '',
    whatsapp: '',
    backgroundImage: '',
  };

  const onSubmit = async (values: ProfessionalWebsiteFormValues) => {
    try {
      setIsSaving(true);

      if (result.data && result.data.id) {
        const response = await updateSite(values, queryClient);

        if (response === false) throw new AppException('Erro ao atualizar site profissional');
      } else {
        const response = await addSite(values, queryClient);

        if (response === false) throw new AppException('Erro ao adicionar site profissional');
      }

      console.log(values);
      setIsSaving(false);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleAddService = () => {
    setFieldValue('services', [...values.services, initialValues.services[0]]);
  };

  const handleAddSpeciality = () => {
    setFieldValue('specialities', [...values.specialities, initialValues.specialities[0]]);
  };

  const handleNavigateToPreview = async () => {
    try {
      const url = `/p/${values.websiteUrl}`;
      console.log(url);

      await onSubmit(values);

      navigate(url);
    } catch (error) {
      console.error(error);
    }
  };

  const getSite_ = async () => {
    try {
      const response = await getSite();

      if (response === false) throw new AppException('Erro ao buscar site profissional');

      return response;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setValues, values, touched, errors, setFieldValue } = formik;
  const { getSite, addSite, updateSite } = useProfessionalSiteStore();

  const result = useQuery({ queryKey: ['professionalSite'], queryFn: getSite_ });

  useEffect(() => {
    result.data &&
      result.data.id &&
      setValues({
        ...result.data,
        websiteColor: result.data.websiteColor || '',
        services: result.data.services?.length
          ? result.data.services.map((service: any) => ({
              serviceName: service.serviceName,
              serviceDescription: service.serviceDescription,
            }))
          : initialValues.services,
        specialities: result.data.specialities?.length
          ? result.data.specialities.map((speciality: any) => ({
              specialityName: speciality.specialityName,
              specialityDescription: speciality.specialityDescription,
            }))
          : initialValues.specialities,
      });
    result.data && result.data.id && setColor(result.data.websiteColor || '#2f55d4');
  }, [result.data, setValues]);

  if (result.isLoading)
    return (
      <div className="vh-100 w-100 d-flex align-items-center pb-5">
        <StaticLoading />
      </div>
    );
  else if (result.isError) {
    console.error(result.error);
    notify('Erro ao buscar site profissional', 'Erro', 'close', 'danger');
  }

  return (
    <>
      <section className="scroll-section" id="title">
        <div className="page-title-container">
          <h1 className="mb-0 pb-0 display-4">{title}</h1>
        </div>
      </section>

      <Row>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit} className="tooltip-end-top">
              <Alert className="text-center mb-3">
                Para criar seu próprio site pessoal, comece por preencher cuidadosamente os campos necessários com suas informações e preferências. Uma vez
                finalizado, este espaço online se tornará o reflexo de sua identidade digital, permitindo que você o compartilhe amplamente através dos links
                nas suas redes sociais. Essa é uma excelente maneira de conectar-se com outros, apresentar suas habilidades, projetos e paixões, estabelecendo
                assim uma presença marcante e personalizada na internet.
              </Alert>

              <label className="mb-3">Insira uma foto de perfil</label>
              <div className="mb-3 top-label">
                <AvatarDropzone formik={formik} />
                {errors.professionalPhotoLink && touched.professionalPhotoLink && <div className="error">{errors.professionalPhotoLink}</div>}
              </div>

              <label className="mb-3">Selecione uma imagem de fundo</label>
              <div className="mb-3 top-label">
                <SelectBackgroundImage formik={formik} value={values.backgroundImage} />
                {errors.backgroundImage && touched.backgroundImage && <div className="error">{errors.backgroundImage}</div>}
              </div>

              <div className="mb-3 top-label">
                <Form.Control type="text" name="presentation" value={values.presentation} onChange={handleChange} />
                <Form.Label>NOME COMPLETO E CRN</Form.Label>
                {errors.presentation && touched.presentation && <div className="error">{errors.presentation}</div>}
              </div>

              <div className="mb-3 top-label">
                <Form.Control type="text" name="impactPhrase" value={values.impactPhrase} onChange={handleChange} />
                <Form.Label>FRASE DE IMPACTO</Form.Label>
                {errors.impactPhrase && touched.impactPhrase && <div className="error">{errors.impactPhrase}</div>}
              </div>

              <div className="mb-5 top-label">
                <Form.Control as="textarea" rows={4} name="aboutMe" value={values.aboutMe} onChange={handleChange} />
                <Form.Label>SOBRE MIM</Form.Label>
                {errors.aboutMe && touched.aboutMe && <div className="error">{errors.aboutMe}</div>}
              </div>

              <div className="mb-5 top-label">
                <Form.Label>Selecione uma cor para o Website</Form.Label>
                <SliderPicker color={websiteColor} onChange={handleChangeSliderPicker} />
                {errors.websiteColor && touched.websiteColor && <div className="error">{errors.websiteColor}</div>}
              </div>

              <label>Serviços prestados</label>
              <div className="mb-3">
                {values.services.map((service, index) => (
                  <ServiceRow service={service} formik={formik} index={index} key={index} />
                ))}
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Adicionar um serviço prestado</Tooltip>}>
                  <Button variant="primary" size="sm" className="mt-1" onClick={handleAddService}>
                    <Icon.Plus />
                  </Button>
                </OverlayTrigger>{' '}
              </div>

              <label>Especialidades</label>
              <div className="mb-3">
                {values.specialities.map((speciality, index) => (
                  <SpecialityRow speciality={speciality} formik={formik} index={index} key={index} />
                ))}
                <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-chart">Adicionar uma especialidade</Tooltip>}>
                  <Button variant="primary" size="sm" className="mt-1" onClick={handleAddSpeciality}>
                    <Icon.Plus />
                  </Button>
                </OverlayTrigger>{' '}
              </div>

              <label>Website URL</label>
              <InputGroup className="mb-3">
                <InputGroup.Text>app.OdontCloud.com.br/p/</InputGroup.Text>
                <FormControl
                  aria-label="Website URL"
                  aria-describedby="basic-addon1"
                  name="websiteUrl" // Adicione o atributo name correspondente ao nome do estado
                  value={values.websiteUrl}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.websiteUrl && touched.websiteUrl && <div className="error">{errors.websiteUrl}</div>}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Instagram</InputGroup.Text>
                <FormControl
                  aria-label="Instgram"
                  aria-describedby="basic-addon1"
                  name="instagram" // Adicione o atributo name correspondente ao nome do estado
                  value={values.instagram}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.instagram && touched.instagram && <div className="error">{errors.instagram}</div>}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Linkedin</InputGroup.Text>
                <FormControl
                  aria-label="linkedin"
                  aria-describedby="basic-addon1"
                  name="linkedin" // Adicione o atributo name correspondente ao nome do estado
                  value={values.linkedin}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.linkedin && touched.linkedin && <div className="error">{errors.linkedin}</div>}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Facebook</InputGroup.Text>
                <FormControl
                  aria-label="facebook"
                  aria-describedby="basic-addon1"
                  name="facebook" // Adicione o atributo name correspondente ao nome do estado
                  value={values.facebook}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.facebook && touched.facebook && <div className="error">{errors.facebook}</div>}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Youtube</InputGroup.Text>
                <FormControl
                  aria-label="youtube"
                  aria-describedby="basic-addon1"
                  name="youtube" // Adicione o atributo name correspondente ao nome do estado
                  value={values.youtube}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.youtube && touched.youtube && <div className="error">{errors.youtube}</div>}
              </InputGroup>

              <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">WhatsApp</InputGroup.Text>
                <FormControl
                  aria-label="whatsapp"
                  aria-describedby="basic-addon1"
                  name="whatsapp" // Adicione o atributo name correspondente ao nome do estado
                  value={values.whatsapp}
                  onChange={handleChange} // Garanta que handleChange está sendo usado corretamente
                />
                {errors.whatsapp && touched.whatsapp && <div className="error">{errors.whatsapp}</div>}
              </InputGroup>

              <div className="text-center">
                <AsyncButton isSaving={isSaving} className="me-1" type="submit" variant="primary">
                  Salvar e publicar Website
                </AsyncButton>

                <AsyncButton isSaving={isSaving} type="button" onClickHandler={handleNavigateToPreview} className="btn btn-primary">
                  Visualizar uma prévia do Website
                </AsyncButton>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
}
