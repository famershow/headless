import {cx} from 'class-variance-authority';

export function QuantitySelector(props: {children: React.ReactNode}) {
  return (
    <div className="flex items-center rounded border">{props.children}</div>
  );
}

export function QuantitySelectorButton(
  props: {
    children?: React.ReactNode;
    variant: 'decrease' | 'increase';
  } & React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  const {children, variant, ...passthroughProps} = props;

  return (
    <button
      aria-label={cx([
        variant === 'decrease' && 'Decrease quantity',
        variant === 'increase' && 'Increase quantity',
      ])}
      className={cx([
        'h-10 w-10 transition',
        variant === 'decrease' && 'disabled:opacity-30',
      ])}
      name={cx([
        variant === 'decrease' && 'decrease-quantity',
        variant === 'increase' && 'increase-quantity',
      ])}
      {...passthroughProps}
    >
      <span>
        {
          {
            decrease: <>&#8722;</>,
            increase: <>&#43;</>,
          }[variant]
        }
      </span>
      {children}
    </button>
  );
}

export function QuantitySelectorValue(props: {children: React.ReactNode}) {
  return (
    <div className="min-w-[2.5rem] px-2 text-center">{props.children}</div>
  );
}
