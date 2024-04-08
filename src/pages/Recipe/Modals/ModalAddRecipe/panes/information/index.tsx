import React from 'react';
import Dropzone, { IFileWithMeta, StatusValue } from 'react-dropzone-uploader';
import { FormikErrors, FormikTouched } from 'formik';
import { Col, Form, Row } from 'react-bootstrap';
import { PatternFormat } from 'react-number-format';
import SelectCategory from './SelectCategory';
import { MultiValue } from 'react-select';
import { FormValues } from '../..';
import api, { apiUrl } from '../../../../../../services/useAxios';
import { Option } from '../../../../../../types/inputs';
import DropzonePreview from '../../../../../../components/dropzone/DropzonePreview';

interface InformationProps {
  errors: FormikErrors<FormValues>;

  touched: FormikTouched<FormValues>;

  values: FormValues;

  // eslint-disable-next-line no-unused-vars
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line no-unused-vars
  setFieldValue: (field: string, value: string | MultiValue<Option>, shouldValidate?: boolean | undefined) => void;
}

export default function Information(props: InformationProps) {
  const getUploadParams = () => ({ url: apiUrl + '/receita-culinaria-diet-system/file' });

  const onChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    if (status === 'done') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      props.setFieldValue('file', file.xhr.response);
    } else if (status === 'removed') {
      if (!file?.xhr?.response) return console.error('Erro ao enviar imagem');
      api.delete('/receita-culinaria-diet-system/file', { data: { url: file.xhr.response } });
      props.setFieldValue('file', '');
    }
  };

  const handleChangeSelect = (newValue: MultiValue<Option>) => {
    props.setFieldValue('categories', newValue);
  };

  const handleChangeShareRecipe = (target: HTMLInputElement) => {
    props.setFieldValue('shareRecipe', target.checked ? 'SIM' : 'NAO');
  }

  return (
    <>
      <div className="top-label mb-3">
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
        {props.errors.file && props.touched.file && <div className="error">{props.errors.file}</div>}
      </div>

      <div className='mb-3'>
          <Form.Check name='shareRecipe' value={1} onChange={(e) => handleChangeShareRecipe(e.target)} type="switch" id="checkedSwitch" label="Compartilhar receita com a comunidade." checked={props.values.shareRecipe === 'SIM'} />
      </div>

      <Row className="align-items-center">
        <Col md={6}>
          <div className="top-label mb-3">
            <Form.Control type="text" name="recipeName" value={props.values.recipeName} onChange={props.handleChange} />
            <Form.Label>NOME DA RECEITA</Form.Label>
            {props.errors.recipeName && props.touched.recipeName && <div className="error">{props.errors.recipeName}</div>}
          </div>
        </Col>
        <Col md={4}>
          <div className="top-label mb-3">
            <SelectCategory
              name="category"
              errors={props.errors}
              touched={props.touched}
              values={props.values}
              value={props.values.categories}
              setFieldValue={props.setFieldValue}
              handleChange={handleChangeSelect}
            />
            <Form.Label>CATEGORIA DA RECEITA</Form.Label>
          </div>
        </Col>
        <Col md={2}>
          <div className="top-label mb-3">
            <PatternFormat
              className="form-control"
              mask="-"
              format="##:##"
              name="preparationTime"
              value={props.values.preparationTime}
              onValueChange={(val) => props.setFieldValue('preparationTime', val.formattedValue)}
            />
            <Form.Label>TEMPO PREPARO</Form.Label>
            {props.errors.preparationTime && props.touched.preparationTime && <div className="error">{props.errors.preparationTime}</div>}
          </div>
        </Col>
      </Row>

      <div className="top-label mb-3">
        <Form.Control name="description" as="textarea" rows={3} value={props.values.description} onChange={props.handleChange} />
        <Form.Label>DESCRICAO DA RECEITA</Form.Label>
        {props.errors.description && props.touched.description && <div className="error">{props.errors.description}</div>}
      </div>
    </>
  );
}
