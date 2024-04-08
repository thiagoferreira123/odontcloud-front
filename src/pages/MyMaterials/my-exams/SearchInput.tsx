import React from 'react';
import CsLineIcons from '/src/cs-line-icons/CsLineIcons';
import { useMyExamsStore } from './hooks/MyExamsStore';

const SearchInput = () => {
  const query = useMyExamsStore((state) => state.query);
  const { setQuery } = useMyExamsStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome do exame"
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
