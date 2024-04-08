import React from 'react';
import { Accordion, Button, Col, Form, Modal, Row, Spinner, useAccordionButton } from 'react-bootstrap';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Yup from 'yup';
import Dropzone, { IFileWithMeta, defaultClassNames } from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css';
import useClassicPlan from '../../hooks/useClassicPlan';
import { useFormik } from 'formik';
import SearchInput from './SearchInput';
import { notify } from '../../../../components/toast/NotificationIcon';
import api from '../../../../services/useAxios';
import { MealImage } from '../../../../types/ImagemRefeicao';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';
import DropzonePreview from '../../../../components/dropzone/DropzonePreview';
import AsyncButton from '../../../../components/AsyncButton';

interface ModalPhotoMealProps {
  show: boolean;
  onClose: () => void;
}

const getPhotos = async () => {
  const response = await api.get('/plano-alimentar-classico-refeicao-foto');

  return response.data;
};

const buildPhotoUrl = (photo: MealImage) => {
  return `https://${photo.host}/${photo.folder ? `${photo.folder}/` : ''}${photo.filename}`;
};

function CustomToggleButton({ children, eventKey, className }: { children: React.ReactNode; eventKey: string; className: string }) {
  const decoratedOnClick = useAccordionButton(eventKey, () => {});

  return (
    <Button className={className} onClick={decoratedOnClick}>
      {children}
    </Button>
  );
}

const ModalPhotoMeal: React.FC<ModalPhotoMealProps> = (props: { show: boolean; onClose: () => void }) => {
  const queryClient = useQueryClient();
  const selectedMeal = useClassicPlan((state) => state.selectedMeal);
  const selectedMealId = useClassicPlan((state) => state.selectedMealId);
  const { updateMeal, updateReplacementMeal } = useClassicPlan();

  const [isSaving, setIsSaving] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [removeFile, setRemoveFile] = React.useState<(() => void) | null>(null);
  const [query, setQuery] = React.useState('' as string);

  const validationSchema = Yup.object().shape({
    description: Yup.string().required('Insira uma descrição válida'),
  });

  const initialValues = { description: '' };

  const onSubmit = async (values: { description: string }) => {
    setIsSaving(true);

    if (!file) return notify('Selecione uma imagem', 'Erro', 'close', 'danger');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('descricao', values.description);

      const response = await api.post('/plano-alimentar-classico-refeicao-foto', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newPhoto = response.data as MealImage;
      queryClient.setQueryData(['photos'], (photos: MealImage[]) => [newPhoto, ...photos])

      handleSelectImage(newPhoto);

      setIsSaving(false);
      if (removeFile) removeFile();
      resetForm();
    } catch (error) {
      notify('Erro ao cadastrar imagem', 'Erro', 'close', 'danger');
      console.error(error);
      setIsSaving(false);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleChange, handleSubmit, resetForm, values, touched, errors } = formik;

  const handleSelectImage = async (photo: MealImage) => {
    if (!selectedMeal) return;
    try {
      if (!selectedMealId) {
        const payload = {
          id: selectedMeal.id,
          linkImagem: buildPhotoUrl(photo),
        };

        updateMeal(payload);

        await api.patch('/plano-alimentar-classico-refeicao/' + selectedMeal.id, payload);
      } else {
        const payload = {
          id: selectedMeal.id,
          id_refeicao: selectedMealId,
          link_imagem: buildPhotoUrl(photo),
        };

        updateReplacementMeal(payload);

        await api.patch('/plano-alimentar-classico-refeicao-substituta/' + selectedMeal.id, payload);
      }
    } catch (error) {
      notify('Erro ao atualizar refeição', 'Erro', 'close', 'danger');
      console.error(error);
    }

    props.onClose();
  };

  const onChangeStatus = ({ remove, file }: IFileWithMeta, status: string) => {
    if (status === 'done') {
      setFile(file);
      setRemoveFile(() => remove);
    } else if (status === 'error_validation') {
      remove();
    } else if (status === 'rejected_file_type') {
      notify('Tipo de arquivo inválido.', 'Erro', 'close', 'danger');
    } else if (status === 'error_file_size') {
      notify('Tamanho de arquivo excede o limite permitido.', 'Erro', 'close', 'danger');
      remove();
    } else if (['rejected_max_files', 'error_upload_params', 'exception_upload', 'aborted', 'restarted', 'error_upload'].includes(status)) {
      remove && remove();
      notify('Erro ao cadastrar imagem', 'Erro', 'close', 'danger');
    }
  };

  const photoResult = useQuery({ queryKey: ['photos'], queryFn: getPhotos, enabled: props.show });

  const filteredPhotos = photoResult.data
    ? photoResult.data.filter((photo: MealImage) => String(photo.descricao).toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleRemovePhoto = async (photo: MealImage) => {
    if (!photo) return;
    try {
      queryClient.setQueryData(['photos'], (photos: MealImage[]) => {
        return photos.filter((p) => p.id !== photo.id);
      });

      await api.delete('/plano-alimentar-classico-refeicao-foto/' + photo.id);
      notify('Foto removida com sucesso', 'Sucesso', 'check', 'success');
    } catch (error) {
      notify('Erro ao remover foto', 'Erro', 'close', 'danger');
      console.error(error);
    }
  };

  return (
    <Modal show={props.show} onHide={props.onClose} backdrop="static" className="modal-close-out">
      <Modal.Header closeButton>
        <Modal.Title>Insira uma imagem na refeição</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="d-flex align-items-end mb-4">
          <div className="me-3">
            <div className="w-100 w-md-auto search-input-container border border-separator">
              <SearchInput query={query} setQuery={setQuery} />
            </div>
          </div>
        </Row>

        <div className="scroll-out">
          <div className="override-native overflow-auto sh-35 pe-3">
            <div className="border-bottom border-separator-light mb-2 pb-2">
              {photoResult.isLoading || photoResult.isFetching || photoResult.isPending ? (
                <div className="w-100 text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : photoResult.isError ? (
                <div className="w-100 text-center">Erro ao carregar imagens</div>
              ) : filteredPhotos.length ? (
                filteredPhotos.map((photo: MealImage) => (
                  <Row className="g-0 sh-6 mb-2" key={photo.id}>
                    <Col xs="auto">
                      <img src={buildPhotoUrl(photo)} className="card-img rounded-xl sh-6 sw-6" alt="thumb" />
                    </Col>
                    <Col>
                      <div className="d-flex flex-row pt-0 pb-0 ps-3 pe-0 h-100 align-items-center justify-content-between">
                        <div className="d-flex flex-column">
                          <div>{photo.descricao}</div>
                        </div>
                        <div className="d-flex">
                          <Button variant="outline-secondary" size="sm" className="ms-1" onClick={() => handleSelectImage(photo)}>
                            Selecionar
                          </Button>
                          {photo.profissional_id ? (
                            <Button variant="outline-secondary" size="sm" className="btn-icon btn-icon-only ms-1" onClick={() => handleRemovePhoto(photo)}>
                              <CsLineIcons icon="bin" />
                            </Button>
                          ) : null}
                        </div>
                      </div>
                    </Col>
                  </Row>
                ))
              ) : (
                <div className="w-100 text-center">Nenhuma imagem encontrada</div>
              )}
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className="w-100">
          <Accordion>
            <Row className="justify-content-center">
              <CustomToggleButton className="mb-1" eventKey="standardCollapse">
                Cadastrar uma imagem própria
              </CustomToggleButton>
            </Row>

            <Accordion.Collapse eventKey="standardCollapse">
              <Col xs="auto">
                <form onSubmit={handleSubmit}>
                  <div className="filled mb-3">
                    <CsLineIcons icon="upload" />
                    <Dropzone
                      autoUpload={false}
                      onChangeStatus={onChangeStatus}
                      PreviewComponent={DropzonePreview}
                      submitButtonContent={null}
                      accept="image/*"
                      maxSizeBytes={5000000}
                      submitButtonDisabled
                      inputWithFilesContent={null}
                      classNames={{ inputLabelWithFiles: defaultClassNames.inputLabel }}
                      inputContent="Clique para fazer o upload da imagem"
                    />
                  </div>
                  <div className="filled mb-3">
                    <CsLineIcons icon="file-text" />
                    {/* ajuste = Colocar validação yup */}
                    <Form.Control
                      type="text"
                      name="description"
                      className="my-2"
                      placeholder="Descrição da imagem"
                      value={values.description}
                      onChange={handleChange}
                    />
                    {errors.description && touched.description && <div className="error">{errors.description}</div>}

                    <AsyncButton isSaving={isSaving} onClickHandler={handleSubmit} type="submit" className="my-2 btn btn-primary w-100">
                      Salvar Foto
                    </AsyncButton>
                  </div>
                </form>
              </Col>
            </Accordion.Collapse>
          </Accordion>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPhotoMeal;
