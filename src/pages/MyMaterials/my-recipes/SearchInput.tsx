import React from 'react';
import { useMyRecipesStore } from './hooks/MyRecipesStore';
import CsLineIcons from '../../../cs-line-icons/CsLineIcons';

// eslint-disable-next-line no-unused-vars
const SearchInput = () => {
  const query = useMyRecipesStore((state) => state.query);
  const { setQuery } = useMyRecipesStore();

  return (
    <>
      <input
        className="form-control datatable-search"
        value={query || ''}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        placeholder="Digite o nome da receita"
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
