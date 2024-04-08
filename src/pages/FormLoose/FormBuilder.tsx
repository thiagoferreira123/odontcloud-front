/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import React, { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import $ from 'jquery';
import '../../settings/bootstrap';
import { useCreateForm, useEditForm } from './Hooks/mutations';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormQuery } from './Hooks/queries';
import classNames from 'classnames';
import { notify } from '../../components/toast/NotificationIcon';

declare global {
  interface JQuery {
    formBuilder(options?: any): any;
  }
}

(window as any).jQuery = $;
(window as any).$ = $;

import 'jquery-ui-sortable';
import 'formBuilder';
import HtmlHead from '../../components/html-head/HtmlHead';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';

type Params = {
  id?: string;
};

const FormBuilder = () => {
  const fb = useRef<HTMLDivElement | null>(null);
  const createForm = useCreateForm();
  const editForm = useEditForm();

  const isPending = createForm.isPending || editForm.isPending;

  const navigate = useNavigate();
  const { id } = useParams<Params>();

  const { data, isFetching } = useFormQuery(id);
  const [formBuilder, setFormBuilder] = useState<any>(null);

  const options = useMemo(() => {
    return {
      disableInjectedStyle: 'bootstrap',
      disabledActionButtons: ['data', 'clear', 'save'],
      disabledAttrs: ['className'],
      disableFields: ['autocomplete', 'button', 'file', 'hidden'],
      i18n: {
        location: 'https://raw.githubusercontent.com/kevinchappell/formBuilder-languages/master/',
        locale: 'pt-BR',
      },
    };
  }, []);

  const handleCreateForm = () => {
    if (!formBuilder) return;
    const formData = formBuilder.getData();
    const payload = {
      data: new Date().toISOString(),
      form: JSON.stringify(formData),
      status: 'ABERTO',
      tipo: 'PROFISSIONAL',
    };

    if (!id) {
      return createForm.mutate(payload, {
        onSuccess: () => {
          notify('Formulário criado com sucesso!', 'Sucesso!', 'check', 'success');
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        },
      });
    }
    editForm.mutate(
      { ...payload, id: +id },
      {
        onSuccess: () => {
          notify('Formulário editado com sucesso!', 'Sucesso!', 'check', 'success');
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        },
      }
    );
  };

  useEffect(() => {
    if (!fb) return;
    setFormBuilder($(fb.current).formBuilder(options));
  }, [fb, options]);

  useEffect(() => {
    if (!data || !formBuilder?.setData) return;

    formBuilder.setData(data.form);

    return () => {
      formBuilder.setData('');
    };
  }, [data, formBuilder]);

  const title = 'Construtor de formulário';

  return (
    <>
      <HtmlHead title={title} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
      </div>
      {/* Title End */}
      <Card className="mb-2">
        <Card.Body>
          <Row className="d-flex justify-content-start">
            <div
              style={{ zIndex: 1000 }}
              className={classNames('mt-5 mb-5', {
                'overlay-spinner': isFetching,
              })}
            >
              <div
                id="fb-editor"
                className={classNames({
                  'd-none': isFetching,
                })}
                ref={fb}
              />
            </div>
          </Row>
        </Card.Body>
      </Card>

      <div className="text-center">
        <Button onClick={handleCreateForm} disabled={isPending} variant="primary" size="lg" className="hover-scale-down">
          {isPending ? (
            <span className="spinner-border spinner-border-sm"></span>
          ) : (
            <div className="d-flex align-items-center justify-content-center gap-2">
              <CsLineIcons icon="save" />
              <span>{id ? 'Editar' : 'Salvar'} formulário</span>
            </div>
          )}
        </Button>
      </div>
    </>
  );
};

export default FormBuilder;
