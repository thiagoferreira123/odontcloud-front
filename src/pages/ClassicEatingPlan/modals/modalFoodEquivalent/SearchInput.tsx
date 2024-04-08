import React from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import useClassicPlan from '../../hooks/useClassicPlan';

// eslint-disable-next-line no-unused-vars
const SearchInput = () => {

  const equivalentFoodsQuery = useClassicPlan((state) => state.equivalentFoodsQuery);
  const {setEquivalentFoodsQuery} = useClassicPlan();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={equivalentFoodsQuery || ''}
        onChange={(e) => {
          setEquivalentFoodsQuery(e.target.value);
        }}
        placeholder="Digite o nome do alimento"
      />
      {equivalentFoodsQuery && equivalentFoodsQuery.length > 0 ? (
        <span
          className="search-delete-icon"
          onClick={() => {
            setEquivalentFoodsQuery('');
          }}
        >
          <CsLineIcons icon="close" />
        </span>
      ) : (
        <span className="search-magnifier-icon pe-none">
          <CsLineIcons icon="search" />
        </span>
      )}
    </>
  );
};

export default SearchInput;
