import { usePatientAuthStore } from '../Auth/PatientLogin/hook/PatientAuthStore';
import usePatientAttachmentMaterialsStore from './hooks';
import { useQuery } from '@tanstack/react-query';
import StaticLoading from '../../components/loading/StaticLoading';
import { MaterialOptions, SendingMaterial } from '../../types/SendingMaterial';
import ClassicEatingPlans from './materials/classic-eating-plan';
import EquivalentEatingPlans from './materials/equivalent-eating-plan';
import Recipes from './materials/recipe';
import AnthropometricAssessment from './materials/anthropometric-assessment';
import RequestingExams from './materials/requesting-exam';
import ManipuledFormulas from './materials/manipulated-formulas';
import QualitativeEatingPlans from './materials/qualitative-eating-plan';
import Orientations from './materials/orientation';
import React from 'react';
import Attachments from './materials/attachment';
import { useAnsweredByPatiendFormStore } from '../PatientMenu/form-patient-registered/hooks/AnsweredByPatiendFormStore';
import { Button, Card, Col, Row } from 'react-bootstrap';
import CsLineIcons from '../../cs-line-icons/CsLineIcons';
import { Link } from 'react-router-dom';
import Empty from '../../components/Empty';

interface MaterialListItem {
  material: string;
  data: SendingMaterial<MaterialOptions>[];
}

export default function Materials() {
  const patient = usePatientAuthStore((state) => state.patient);

  const { getPatientAttachmentMaterials } = usePatientAttachmentMaterialsStore();
  const { getPatientAnswers } = useAnsweredByPatiendFormStore();

  const getPatientAttachmentMaterials_ = async () => {
    try {
      if (!patient?.id) throw new Error('Paciente não encontrado');

      const response = await getPatientAttachmentMaterials(patient.id);

      if (response === false) throw new Error('Erro ao buscar materiais do paciente');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getPatientAnswers_ = async () => {
    try {
      if (!patient?.id) throw new Error('Paciente não encontrado');

      const response = await getPatientAnswers(patient.id.toString());

      if (response === false) throw new Error('Erro ao buscar formulários');

      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const result = useQuery({ queryKey: ['patient-materials', patient?.id], queryFn: getPatientAttachmentMaterials_, enabled: !!patient?.id });
  const formResult = useQuery({ queryKey: ['patient-answers', patient?.id], queryFn: getPatientAnswers_, enabled: !!patient?.id });

  if (result.isLoading || formResult.isLoading)
    return (
      <div className="position-fixed start-0 top-0 vh-100 w-100 d-flex align-items-center">
        <StaticLoading />
      </div>
    );
  else if (result.isError || formResult.isError) {
    return (
      <div className="position-fixed start-0 top-0 vh-100 w-100 d-flex align-items-center">
        <div className="w-100 text-center">
          <h1 className="text-danger">Erro ao buscar materiais do paciente</h1>
          <p className="text-danger">Tente novamente mais tarde</p>
        </div>
      </div>
    );
  }

  const materialItems = result.data?.reduce((acc: MaterialListItem[], material) => {
    if (acc.find((m) => m.material === material.material)) {
      const index = acc.findIndex((m) => m.material === material.material);
      acc[index].data.push(material);
    } else {
      acc.push({ material: material.material, data: [material] });
    }

    return acc;
  }, []) ?? [];

  return (
    <>
      {!result.data?.length ? (
        <div className="sh-30 start-0 top-0 w-100 d-flex align-items-center justify-content-center">
          <Empty message='Nenhum material disponível' />
        </div>
      ) : (
        materialItems.map((materialItem, index) => (
          <React.Fragment key={materialItem.material + index}>
            {materialItem.data?.filter((material) => material.material === 'plano_alimentar').length ? (
              <ClassicEatingPlans materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'plano_alimentar_equivalente').length ? (
              <EquivalentEatingPlans materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'receitas').length ? <Recipes materials={materialItem.data} index={index} /> : null}

            {materialItem.data?.filter((material) => material.material === 'avaliacao_antropometrica').length ? (
              <AnthropometricAssessment materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'exame').length ? (
              <RequestingExams materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'formulas_manipuladas').length ? (
              <ManipuledFormulas materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'plano_qualitativo').length ? (
              <QualitativeEatingPlans materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'orientacao').length ? (
              <Orientations materials={materialItem.data} index={index} />
            ) : null}

            {materialItem.data?.filter((material) => material.material === 'anexos').length ? (
              <Attachments materials={materialItem.data} index={index} />
            ) : null}
          </React.Fragment>
        ))
      )}

      {formResult.data?.map((form) => (
          <Row className="g-0" key={form.id}>
            <Col xs="auto" className="sw-7 d-flex flex-column justify-content-center align-items-center position-relative me-4" key={form.id}>
              <div className="w-100 d-flex h-100 justify-content-center position-relative">
                <div className="line-w-1 bg-separator h-100 position-absolute" />
              </div>
              <div className="bg-foreground sw-7 sh-7 rounded-xl shadow d-flex flex-shrink-0 justify-content-center align-items-center mt-n2 position-relative">
                <div className="bg-gradient-light sw-5 sh-5 rounded-xl">
                  <div className="text-white d-flex justify-content-center align-items-center h-100">
                    <CsLineIcons icon="form" />
                  </div>
                </div>
              </div>
              <div className="w-100 d-flex h-100 justify-content-center position-relative">
                <div className="line-w-1 bg-separator h-100 position-absolute" />
              </div>
            </Col>
            <Col className="mb-2">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-start">
                  <div className="d-flex flex-column">
                    <Button variant="link" className="p-0 heading text-start">
                      Formulário - {form.nome}
                    </Button>
                    <div className="text-alternate mb-2">
                      Disponibilizado em: {new Date(form.data).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="mt-1">
                      <Link
                        to={`${window.location.origin}/formulario-pre-consulta-preencher/${form.key}`}
                        className="btn btn-primary btn-icon btn-icon-start mb-1 hover-scale-up"
                      >
                        <CsLineIcons icon="arrow-double-right" /> <span>Responder formulário</span>
                      </Link>{' '}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      }
    </>
  );
}
