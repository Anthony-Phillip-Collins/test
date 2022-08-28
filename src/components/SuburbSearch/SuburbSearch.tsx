import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { ResultsList } from '../ResultsList/ResultsList';
import cn from 'classnames';
import styles from './SuburbSearch.module.css';
import { concatSuburb, Suburb, useSuburb } from '../../hooks/useSuburb';

export function SuburbSearch() {
  const [selectedSuburb, setSelectedSuburb] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>('');
  const { items, isLoading, isError } = useSuburb(searchValue);
  const inputRef = useRef<HTMLInputElement>(null);

  function onSelect(suburb: Suburb) {
    const result = concatSuburb(suburb);
    setSelectedSuburb(result);
    setSearchValue(result);
    inputRef.current?.focus();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedSuburb('');
    setSearchValue(event.target.value);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert(
      selectedSuburb
        ? `You have selected the following suburb: ${selectedSuburb}`
        : 'Please select a suburb.'
    );
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={styles.SuburbSearch}>
      <span className={styles.label}>Suburb</span>
      <div className={styles.container}>
        <form onSubmit={onSubmit}>
          <label className='sr-only' htmlFor='suburb-search-input'>
            Suburb
          </label>
          <Input
            ref={inputRef}
            id='suburb-search-input'
            onChange={onChange}
            value={selectedSuburb || searchValue}
            autoComplete='off'
            role='combobox'
            aria-autocomplete='list'
            aria-owns='result-list'
            aria-expanded={items?.length > 0}
          />
          <Button type='submit' />
        </form>
        <div className={cn(styles.results, isLoading && styles.loading)}>
          {items?.length > 0 && (
            <ResultsList
              {...{ onSelect, items, searchValue }}
              id='result-list'
              noDuplicates={true}
              role='listbox'
            />
          )}
          {isError && (
            <span className={styles.error}>
              Something went wrong, please try again later.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
