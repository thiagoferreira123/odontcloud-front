import React from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useMyManipulatedFormulasStore } from './hooks/MyManipulatedFormulasStore';

const SearchInput = () => {
  const query = useMyManipulatedFormulasStore((state) => state.query);
  const { setQuery } = useMyManipulatedFormulasStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome da fórmula manipulada"
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
    </>
  );
};

export default SearchInput;
