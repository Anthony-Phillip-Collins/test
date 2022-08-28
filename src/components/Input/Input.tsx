import React, { useState, useEffect, forwardRef } from 'react';
import cn from 'classnames';
import styles from './Input.module.css';

export type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface Props {
  className?: string;
  id?: string;
  value?: string;
  placeholder?: string;
  onChange: (event: InputChangeEvent) => void;
  [x: string]: any;
}

export type Ref = HTMLInputElement;

export const Input = forwardRef<Ref, Props>(
  (
    { className, id, value = '', placeholder, onChange, ...otherProps }: Props,
    ref
  ) => {
    const [inputValue, setInputValue] = useState<string>(value);

    // Keep the current value, unless the parent component supplies a different "value" prop.
    useEffect(() => {
      setInputValue(value);
    }, [value]);

    function handleChange(event: InputChangeEvent) {
      setInputValue(event.target.value);
      onChange && onChange(event);
    }

    return (
      <input
        ref={ref}
        className={cn(styles.Input, className)}
        id={id}
        type='text'
        value={inputValue}
        onChange={handleChange}
        {...otherProps}
      />
    );
  }
);
