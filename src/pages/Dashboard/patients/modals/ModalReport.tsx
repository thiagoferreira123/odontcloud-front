import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useFormik } from 'formik';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DropzoneImages from '/src/views/interface/forms/controls/dropzone/DropzoneImages';
import * as Yup from 'yup';

interface ModalImportPatientProps {
  showModal: boolean;
}

// category {
//   bug: string;
//   upgrade: string;
// }

// functionality {
//   Formulário pré - consulta
//   Pasta do paciente
//   Alerta de hidratação
//   Anamnese
//   Prontuário
//   Recordatório alimentar
//   Antropometria
//   Fotos comparativas
//   Predição de gasto calórico
//   Planejamento alimentar
//   Receitas culinárias
//   Orientações
//   Anexos de materiais
//   Solicitação de exames
//   Fórmulas manipuladas
//   Estipule metas
//   Rastreamento metabólico
//   Sinais e sintomas
//   Teia de interconexões
//   Checklist de condutas nutricionais
//   Videochamada
//   Agenda
//   Controle financeiro
//   Inserção de dados
//   Site pessoal
//   Blog
//   Chat
//   Pacientes
//   Lâminas
//   Cadastro de materiais
//   Cursos
//   Envio de e - mails
//   Pagamento de assinatura
//   Outros
// }

const ModalReport = ({ showModal }: ModalImportPatientProps) => {

  const validationSchema = Yup.object().shape({
    category: Yup.string().nullable().required('Insira uma categoria'),
    functionality: Yup.string().nullable().required('Insira uma funcionalidade'),
    description: Yup.string().nullable().required('Insira uma descrição').min(100, 'A descrição deve ter no mínimo 100 caracteres'),
  });

  const initialValues = { category: '', functionality: '', description: '' };
  const onSubmit = (values) => console.log('submit form', values);

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;


  function handleClose(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Modal size="lg" className="modal-close-out" backdrop="static" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton> <Modal.Title>Encontrou uma falha ou gostaria de sugerir uma melhoria?</Modal.Title></Modal.Header>
      <Modal.Body className="mt-4" >

        <Form onSubmit={handleSubmit} className="tooltip-end-top">

          <div className="mb-3 top-label">
            <Form.Control type="text" name="email" value={values.category} onChange={handleChange} />
            <Form.Label>CATEGORIA</Form.Label>
            {errors.category && touched.category && <div className="error">{errors.category}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control type="text" name="functionality" value={values.functionality} onChange={handleChange} />
            <Form.Label>FUNCIONALIDADE</Form.Label>
            {errors.functionality && touched.functionality && <div className="error">{errors.functionality}</div>}
          </div>

          <div className="mb-3 top-label">
            <Form.Control name="description" as="textarea" rows={3} value={values.description} onChange={handleChange} />
            <Form.Label>DESCREVA COM DETALHES</Form.Label>
            {errors.description && touched.description && <div className="error">{errors.description}</div>}
          </div>

          <div className="filled">
            <CsLineIcons icon="upload" />
            <DropzoneImages inputContent="Drop" />
          </div>

          <div className="text-center mt-3">
            <Button type="submit" variant="primary">
              Enviar para o suporte
            </Button>
          </div>

        </Form>

      </Modal.Body>
    </Modal>
  );
};

export default ModalReport;
