import type {Dispatch} from 'react';

import {cx} from 'class-variance-authority';
import {Button, Group, Input, Label, NumberField} from 'react-aria-components';

import {useSanityThemeContent} from '~/hooks/useSanityThemeContent';

export function QuantitySelector(props: {
  isOutOfStock?: boolean;
  setQuantity: Dispatch<React.SetStateAction<number>>;
}) {
  const {themeContent} = useSanityThemeContent();
  const buttonClass = cx([
    'aspect-square w-10 rounded border',
    'disabled:opacity-50',
  ]);

  return (
    <NumberField
      defaultValue={1}
      isDisabled={props.isOutOfStock}
      minValue={1}
      onChange={props.setQuantity}
    >
      <Label hidden>{themeContent?.product?.quantitySelector}</Label>
      <Group className="flex items-center gap-2">
        <Button className={buttonClass} slot="decrement">
          -
        </Button>
        <Input className="rounded border-[rgb(var(--textColor))]" />
        <Button className={buttonClass} slot="increment">
          +
        </Button>
      </Group>
    </NumberField>
  );
}
