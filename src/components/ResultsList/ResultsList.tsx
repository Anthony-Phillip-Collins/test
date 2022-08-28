import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './ResultsList.module.css';
import { concatSuburb, Suburb } from '../../hooks/useSuburb';

interface Props {
  className?: string;
  items: Suburb[];
  searchValue: string;
  noDuplicates?: boolean;
  onSelect: (item: Suburb) => void;
  [x: string]: any;
}

export function ResultsList({
  className,
  items = [],
  searchValue = '',
  noDuplicates,
  onSelect,
  ...otherProps
}: Props) {
  const [filteredItems, setFilteredItems] = useState(items);

  function styledSuburb(item: Suburb) {
    const suburb = concatSuburb(item);
    if (suburb.indexOf(searchValue) === 0) {
      return (
        <>
          {searchValue}
          <strong>{suburb.substring(searchValue.length)}</strong>
        </>
      );
    } else {
      return suburb;
    }
  }

  useEffect(() => {
    const uniqueItems: Suburb[] = [];
    items.forEach((item) => {
      const duplicates = uniqueItems.filter(
        (uniqueItem) => concatSuburb(uniqueItem) === concatSuburb(item)
      );
      if (duplicates.length === 0) {
        uniqueItems.push(item);
      }
    });
    setFilteredItems(noDuplicates ? uniqueItems : items);
  }, [items, noDuplicates]);

  return (
    <ul className={cn(styles.ResultsList, className)} {...otherProps}>
      {filteredItems &&
        filteredItems.map((item, index) => (
          <li
            key={'item' + index}
            className={cn(styles.item)}
            role='option'
            aria-selected={false}
            aria-posinset={index + 1}
            aria-setsize={filteredItems.length}
          >
            <button
              className={cn(styles.button)}
              onClick={() => onSelect && onSelect(item)}
            >
              {styledSuburb(item)}
            </button>
          </li>
        ))}
    </ul>
  );
}
