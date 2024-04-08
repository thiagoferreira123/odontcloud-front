import React from 'react';
import { useSelectTrackingForPatientModalStore } from '../../hooks/SelectTrackingForPatientModalStore';
import CsLineIcons from '../../../../cs-line-icons/CsLineIcons';

const SearchInput = () => {

  const query = useSelectTrackingForPatientModalStore((state) => state.query);

  const { setQuery } = useSelectTrackingForPatientModalStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome do paciente"
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
