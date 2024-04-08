import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { Option } from '../../../types/inputs';
import { MultiValue } from 'react-select';
import { ITemplate } from '../hooks/TemplateStore';
import { UseQueryResult } from '@tanstack/react-query';
import { useFiltersStore } from '../hooks/FiltersStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { Col, Form, Row } from 'react-bootstrap';

interface FiltersProps {
  templatesResult: UseQueryResult<ITemplate[], Error>;
}

export default function Filters(props: FiltersProps) {
  const [value, setValue] = useState<MultiValue<Option>>();
  const query = useFiltersStore((state) => state.query);
  const showOnlyMyTemplates = useFiltersStore((state) => state.showOnlyMyTemplates);
  const options =
    props.templatesResult.data?.reduce((acc: Option[], template) => {
      if (acc.find((option) => option.value === template.categoria)) return acc;

      acc.push({ value: template.categoria, label: template.categoria });
      return acc;
    }, []) ?? [];

  const { setSelectedCategories, setQuery, setOnlyMyTemplates } = useFiltersStore();

  const handleChangeCategory = (newValue: MultiValue<Option>) => {
    setSelectedCategories(newValue as Option[]);
    setValue(newValue);
  };

  return (
    <>
      <Row>
        <Col>
          <CreatableSelect
            classNamePrefix="react-select"
            isMulti
            isClearable={false}
            options={options}
            value={value}
            onChange={handleChangeCategory}
            placeholder="Selecione uma categoria"
          />
        </Col>
        <Col className='ps-0'>
          <div className="w-100 w-md-auto search-input-container border border-separator">
            <input
              className="form-control datatable-search"
              value={query || ''}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              placeholder="Busque pelo nome da fórmula"
            />
            {query && query.length > 0 ? (
              <span
                className="search-delete-icon"
                onClick={() => {
                  setQuery('');
                }}
              >
                <CsLineIcons icon="close" />
              </span>
            ) : (
              <span className="search-magnifier-icon pe-none">
                <CsLineIcons icon="search" />
              </span>
            )}
          </div>
        </Col>
      </Row>

      <div className='mt-2'>
        <Form.Check
          className="mb-3"
          type="switch"
          id="customSwitch"
          label="Exibir apenas as minhas receitas"
          onChange={(e) => setOnlyMyTemplates(e.target.checked)}
          defaultChecked={showOnlyMyTemplates}
        />
      </div>
    </>
  );
}
