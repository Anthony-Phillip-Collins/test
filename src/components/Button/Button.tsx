import iconPath from './icons.svg';
import cn from 'classnames';
import styles from './Button.module.css';

interface Props {
  className?: string;
  type?: 'submit' | 'reset' | 'button';
  onClick?: () => void;
  [x: string]: any;
}

export const Button = ({
  className,
  type = 'button',
  onClick,
  ...otherProps
}: Props) => (
  <button
    type={type}
    className={cn(styles.Button, className)}
    onClick={onClick}
    {...otherProps}
  >
    <svg viewBox='0 0 24 24' width='24' height='16'>
      <use xlinkHref={iconPath + '#dls-icon-arrow-right'} />
    </svg>
  </button>
);
