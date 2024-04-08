import React from 'react';
import { Modal } from 'react-bootstrap';
import { useFormPreviewModalStore } from '../Hooks/modals/FormPreviewModalStore';
import { AnsweredFormValue, FormItem } from '../../../types/FormBuilder';
import Empty from '../../../components/Empty';

const FormPreviewModal = () => {
  const selectedAnsweredForm = useFormPreviewModalStore((state) => state.selectedAnsweredForm);
  const showModal = useFormPreviewModalStore((state) => state.showModal);

  const parsedAnswer = JSON.parse(selectedAnsweredForm?.respostas ?? '{}').options?.formData ?
    JSON.parse(selectedAnsweredForm?.respostas ?? '{}').options?.formData : selectedAnsweredForm?.respostas ?
    (JSON.parse(selectedAnsweredForm.respostas) as FormItem[]) : selectedAnsweredForm?.resposta ?
    (JSON.parse(selectedAnsweredForm.resposta.respostas) as FormItem[]) : [];

  const { hideModal } = useFormPreviewModalStore();

  const getOptionValue = ({ values, userData }: { values: AnsweredFormValue[], userData: string[]  }) => {
    if (!userData.length) return '';
    const answers = userData.map((data: string) => values.find((labelValue: { value: string }) => labelValue.value === data)?.label);
    return answers.join(', ');
  };

  return (
    <Modal className="modal-close-out" size="lg" backdrop="static" show={showModal} onHide={hideModal}>
      <Modal.Header closeButton>
        <Modal.Title>{selectedAnsweredForm?.nome}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!parsedAnswer || !Array.isArray(parsedAnswer) || parsedAnswer.length === 0 ? (
          <Empty disableMargin message="Não há respostas nesse formulário" />
        ) : (
          <>
            {parsedAnswer.map((p, index) => (
              <React.Fragment key={index}>
                {['cabeçalho', 'parágrafo'].includes(p.label.toLowerCase()) ? null : (
                  <div className="d-flex mb-2 flex-column">
                    <span className="font-weight-bold">{p.label}</span>
                    <span className="text-medium">{p.values ? getOptionValue({ values: p.values, userData: p.userData }) : p.userData?.[0] || ''}</span>
                  </div>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormPreviewModal;
