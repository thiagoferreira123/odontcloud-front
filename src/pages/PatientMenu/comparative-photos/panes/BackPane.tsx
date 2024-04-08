import React, { useState } from 'react';
import { Alert, Button, Col, Form, Row, Tab } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader';
import api, { apiUrl } from '../../../../services/useAxios';
import DropzonePreview from '../../../../components/dropzone/DropzonePreview';
import 'react-dropzone-uploader/dist/styles.css';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { PatternFormat } from 'react-number-format';
import useComparativePhotosStore from '../hooks';
import { useQueryClient } from '@tanstack/react-query';
import { ComparativePhotos, SectionType } from '../hooks/types';
import { useParams } from 'react-router-dom';
import AsyncButton from '../../../../components/AsyncButton';
import { convertIsoToBrDate, parseBrDateToIso } from '../../../../helpers/DateHelper';
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react';
import { Link } from 'react-router-dom';
import Empty from '../../../../components/Empty';
import { Gallery, Item } from 'react-photoswipe-gallery';

export interface FormValues {
  filename: string;
  observation: string;
  date: string;
}

interface FrontPaneProps {
  photos: ComparativePhotos[];
}

export default function FrontPane({ photos }: FrontPaneProps) {
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();

  const [isSaving, setIsSaving] = useState(false);
  const [deleteLoadingButtons, setDeleteLoadingButtons] = useState<number[]>([]);
  const [deleteApiEnabled, setDeleteApiEnabled] = useState(true);
  const [removeFile, setRemoveFile] = useState<(() => void) | null>(null);

  const validationSchema = Yup.object().shape({
    filename: Yup.string().required('Insira uma imagem'),
    observation: Yup.string(),
    date: Yup.string().required('Insira uma data'),
  });

  const initialValues: FormValues = {
    filename: '',
    observation: '',
    date: '',
  };

  const getUploadParams = () => ({ url: apiUrl + '/antropometria-foto/file' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      setFieldValue('filename', file.xhr.response.split('/').pop());
      setRemoveFile(() => file.remove);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      deleteApiEnabled && api.delete('/antropometria-foto/file', { data: { url: file.xhr.response.split('/').pop() } });
      setFieldValue('filename', '');
      setDeleteApiEnabled(true);
    }
  };

  const openLightbox = (index: number) => {
    // setPhotoIndex(index);
    // setIsOpen(true);
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (!id) throw new Error('Patient id not found');

      setIsSaving(true);
      setDeleteApiEnabled(false);

      const payload = {
        ...values,
        date: parseBrDateToIso(values.date),
        patient_id: +id,
        host: 'OdontCloud-images.s3.us-east-2.amazonaws.com',
        folder: 'fotos-avaliacao-fisca',
        section: 'TRES' as SectionType,
      };

      const response = await addComparativePhotosDetail(payload, queryClient);

      if (response === false) throw new Error('Erro ao adicionar foto');

      setIsSaving(false);
      resetForm();
      removeFile && removeFile();
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  const handleDeletePhoto = async (photo: ComparativePhotos) => {
    try {
      setDeleteLoadingButtons([...deleteLoadingButtons, photo.id]);
      const response = await removeComparativePhotosDetail(photo, queryClient);

      if (response === false) throw new Error('Erro ao deletar foto');

      deleteApiEnabled && api.delete('/antropometria-foto/file', { data: { url: `https://${photo.host}/${photo.folder}/${photo.filename}` } });

      setDeleteLoadingButtons(deleteLoadingButtons.filter((id) => id !== photo.id));
    } catch (error) {
      setDeleteLoadingButtons(deleteLoadingButtons.filter((id) => id !== photo.id));
      console.error(error);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, setFieldValue, resetForm, values, touched, errors } = formik;
  const { addComparativePhotosDetail, removeComparativePhotosDetail } = useComparativePhotosStore();

  return (
    <Tab.Pane eventKey="Third">
      <div className="scroll-out">
        <div className="override-native overflow-auto d-flex gap-4">
          {!photos.length ? (
            <div className="d-flex justify-content-center align-items-center w-100 h-100">
              <Empty message="Nenhuma foto encontrada" />
            </div>
          ) : (
            <Gallery>
              {photos.map((photo) => (
                <Col md={2} key={photo.id}>
                  <p className="text-medium text-center">Foto retirada em: {convertIsoToBrDate(photo.date)}</p>
                  <div className="d-flex card hover-img-scale-up position-relative">
                    <Item
                      original={`https://${photo.host}/${photo.folder}/${photo.filename}`}
                      thumbnail={`https://${photo.host}/${photo.folder}/${photo.filename}`}
                      width="1024"
                      height="768"
                    >
                      {({ ref, open }) => (
                        <img
                          className="card-img sh-25 scale cursor-pointer"
                          src={photo.filename ? `https://${photo.host}/${photo.folder}/${photo.filename}` : '/img/product/small/product-2.webp'}
                          alt="card image"
                          ref={ref}
                          onClick={open}
                        />
                      )}
                    </Item>
                    <AsyncButton
                      isSaving={deleteLoadingButtons.includes(photo.id)}
                      variant="tertiary"
                      size="sm"
                      className="btn-icon btn-icon-only position-absolute"
                      style={{ top: '10px', right: '10px' }}
                      onClickHandler={() => handleDeletePhoto(photo)}
                    >
                      <Icon.Trash3 size={15} />
                    </AsyncButton>
                    <Link
                      to={`https://${photo.host}/${photo.folder}/${photo.filename}`}
                      download
                      target="_blank"
                      className="btn btn-sm btn-tertiary btn-icon btn-icon-only position-absolute"
                      style={{ top: '10px', right: '50px' }}
                    >
                      <Icon.Download size={15} />
                    </Link>
                  </div>
                  {photo.observation ? (
                    <Alert variant="light" className="mt-1">
                      {photo.observation}
                    </Alert>
                  ) : null}
                </Col>
              ))}
            </Gallery>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mt-5">
          <div className="position-relative">
            <Dropzone
              getUploadParams={getUploadParams}
              PreviewComponent={DropzonePreview}
              submitButtonContent={null}
              accept="image/*"
              submitButtonDisabled
              inputWithFilesContent={null}
              onChangeStatus={onChangeStatus}
              inputContent="Insira uma imagem"
              maxFiles={1}
            />
            {errors.filename && touched.filename && <div className="d-block invalid-tooltip">{errors.filename}</div>}
          </div>

          <div className="d-flex mb-2">
            <Col md={9} className="mb-1 mt-3 top-label me-2">
              <Form.Control type="text" name="observation" placeholder="Observação" value={values.observation} onChange={handleChange} />
              <Form.Label>ESCREVA UMA OBSERVAÇÃO</Form.Label>
              {errors.observation && touched.observation && <div className="d-block invalid-tooltip">{errors.observation}</div>}
            </Col>
            <Col md={3} className="mb-1 mt-3 top-label me-2">
              <PatternFormat
                className="form-control"
                name="date"
                format="##/##/####"
                mask="_"
                placeholder="DD/MM/YYYY"
                value={values.date}
                onChange={handleChange}
              />
              <Form.Label>DATA</Form.Label>
              {errors.date && touched.date && <div className="error">{errors.date}</div>}
            </Col>
          </div>
        </div>

        <div className="text-center mb-3">
          <AsyncButton isSaving={isSaving} size="lg" className="mb-2" type="submit">
            {' '}
            <Icon.Upload className="me-3" />
            Fazer upload da imagem
          </AsyncButton>
        </div>
      </form>
    </Tab.Pane>
  );
}
