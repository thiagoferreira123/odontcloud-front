/* eslint-disable no-unused-labels */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import HtmlHead from '/src/components/html-head/HtmlHead';
import BreadcrumbList from '/src/components/breadcrumb-list/BreadcrumbList';

import { FilterDays } from './FilterDays';
import Loading from '/src/components/loading/Loading';
import { useDiaryFood } from '/src/hooks/useDiaryFood';
import { CardFood } from './CardFood';
import { RegistroRefeicao } from '/src/types/RegistroRefeicao';
import StaticLoading from '/src/components/loading/StaticLoading';
import Empty from '/src/components/Empty';

interface Paciente {
  value: string;
  label: string;
}

const BlogList = () => {
  const [data, setData] = useState<RegistroRefeicao[]>([]);
  const [originalData, setOrignialData] = useState<RegistroRefeicao[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[] | any[]>([]);
  const [loading, setLoading] = useState(false);

  const idProfissional = data.find((item) => item.id_profissional);

  const title = 'Diário alimentar';
  const description = 'Blog List';

  const breadcrumbs = [
    { to: '', text: 'Home' },
    { to: 'pages', text: 'Pages' },
    { to: 'pages/blog', text: 'Blog' },
  ];
  const { mutateAsync: getDados, isPending: isLoading } = useDiaryFood();

  const getDadosRegistros = async (days: string, idProfissional?: string, dataInicio?: string, dataFinal?: string) => {
    setLoading(true);
    try {
      const response = await getDados({ days, idProfissional, dataInicio, dataFinal });

      if (response) {
        setData(response);
        setOrignialData(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDadosRegistros('30');
  }, []);

  useEffect(() => {
    const nomesExistentes = new Set();

    const pacientesAtualizados = originalData
      .map((item) => {
        const nomePaciente = item.paciente_nome;

        if (!nomesExistentes.has(nomePaciente)) {
          nomesExistentes.add(nomePaciente);
          return {
            value: nomePaciente,
            label: nomePaciente,
          };
        }

        return null;
      })
      .filter(Boolean);

    setPacientes(pacientesAtualizados);
    setOrignialData(originalData);
    
  }, [originalData]);

  const handlePacienteFilter = async (paciente: string) => {

    const filter = originalData.filter((refeicao) => refeicao.paciente_nome === paciente);

    setData(filter);
  };

  if (loading) <Loading />;

  return (
    <>
      <HtmlHead title={title} description={description} />
      {/* Title Start */}
      <div className="page-title-container">
        <h1 className="mb-0 pb-0 display-4">{title}</h1>
        <BreadcrumbList items={breadcrumbs} />
      </div>
      {/* Title End */}
      <Row className="g-5">
        <Col md={8} className="mb-5">
          {isLoading ? <StaticLoading /> : data.length ? data.map((item) => <CardFood key={item.id} food={item} />) : <Empty />}
        </Col>

        <Col md={4}>
          <FilterDays
            filterSelect={handlePacienteFilter}
            pacientes={pacientes}
            idProfissional={idProfissional?.id_profissional}
            getFiltring={getDadosRegistros}
          />
        </Col>
      </Row>
    </>
  );
};

export default BlogList;
