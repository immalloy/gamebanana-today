import type { ButtonHTMLAttributes, ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

type BaseProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  className?: string;
};

function classNames(...values: Array<string | false | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function Box({ children, className, vertical, horizontal, align, justify, fill, ...rest }: BaseProps & {
  vertical?: boolean;
  horizontal?: boolean;
  align?: boolean;
  justify?: boolean;
  fill?: boolean;
}): JSX.Element {
  return (
    <div
      className={classNames(
        'Box',
        vertical && 'vertical',
        horizontal && 'horizontal',
        align && 'align',
        justify && 'justify',
        fill && 'fill',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Button({ children, className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element {
  return (
    <button className={classNames('Button', className)} type={type} {...rest}>
      {children}
    </button>
  );
}

interface DropdownOption<T extends string> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  options: Array<DropdownOption<T>>;
  value: T;
  onChange: (value: T) => void;
}

export function Dropdown<T extends string>({ options, value, onChange, className, ...rest }: DropdownProps<T>): JSX.Element {
  return (
    <select className={classNames('Dropdown', className)} value={value} onChange={(event) => onChange(event.target.value as T)} {...rest}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Frame({ children, className, ...rest }: BaseProps): JSX.Element {
  return (
    <div className={classNames('Frame', className)} {...rest}>
      {children}
    </div>
  );
}

interface HeaderBarComponent {
  (props: BaseProps & { titlebar?: boolean }): JSX.Element;
  Title: (props: BaseProps & { subtitle?: ReactNode; fill?: boolean }) => JSX.Element;
  Controls: (props: BaseProps) => JSX.Element;
}

export const HeaderBar = (({ children, className, titlebar, ...rest }: BaseProps & { titlebar?: boolean }) => (
  <div className={classNames('HeaderBar', titlebar && 'titlebar', className)} {...rest}>
    <Box horizontal align fill>
      {children}
    </Box>
  </div>
)) as HeaderBarComponent;

HeaderBar.Title = function HeaderBarTitle({ children, subtitle, className, fill }: BaseProps & { subtitle?: ReactNode; fill?: boolean }): JSX.Element {
  return (
    <Box vertical fill align justify className={classNames('HeaderBar__title', fill && 'Box__fill', className)}>
      <div className="title">{children}</div>
      {subtitle ? <div className="subtitle">{subtitle}</div> : null}
    </Box>
  );
};

HeaderBar.Controls = function HeaderBarControls({ children, className }: BaseProps): JSX.Element {
  return (
    <Box horizontal align className={classNames('HeaderBar__controls control-buttons', className)}>
      {children}
    </Box>
  );
};

export function InfoBar({ children, className, ...rest }: BaseProps): JSX.Element {
  return (
    <div className={classNames('InfoBar', className)} {...rest}>
      {children}
    </div>
  );
}

interface InputComponent {
  (props: InputHTMLAttributes<HTMLInputElement>): JSX.Element;
  Group: (props: BaseProps) => JSX.Element;
}

export const Input = (({ className, onChange, ...rest }: InputHTMLAttributes<HTMLInputElement>) => (
  <input className={classNames('Input', className)} onChange={onChange as ((event: ChangeEvent<HTMLInputElement>) => void) | undefined} {...rest} />
)) as InputComponent;

Input.Group = function InputGroup({ children, className, ...rest }: BaseProps): JSX.Element {
  return (
    <div className={classNames('Input__group', className)} {...rest}>
      {children}
    </div>
  );
};

export function Spinner({ className, ...rest }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={classNames('Spinner', className)} role="status" aria-label="Loading" {...rest} />;
}

export function Switch({ value, onChange, className, label, ...rest }: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
}): JSX.Element {
  return (
    <label className={classNames('Switch', className)}>
      <input
        type="checkbox"
        checked={Boolean(value)}
        aria-label={label}
        onChange={(event) => onChange?.(event.target.checked)}
        {...rest}
      />
      <span aria-hidden="true" />
    </label>
  );
}
