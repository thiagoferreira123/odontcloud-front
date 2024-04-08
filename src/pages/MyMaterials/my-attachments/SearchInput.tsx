import React from 'react';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';
import { useMyAttachmentStore } from './hooks';

const SearchInput = () => {
  const query = useMyAttachmentStore((state) => state.query);
  const { setQuery } = useMyAttachmentStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome do material"
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
