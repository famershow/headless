import type {Location} from '@remix-run/react';
import type {
  Filter,
  ProductFilter,
} from '@shopify/hydrogen/storefront-api-types';
import type {SyntheticEvent} from 'react';

import {Disclosure, Menu} from '@headlessui/react';
import {CaretDownIcon} from '@radix-ui/react-icons';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from '@remix-run/react';
import {useMemo, useState} from 'react';
import {useDebounce} from 'react-use';

import {IconFilters} from '../icons/IconFilters';
import {IconXMark} from '../icons/IconXMark';

export type AppliedFilter = {
  filter: ProductFilter;
  label: string;
};

export type SortParam =
  | 'best-selling'
  | 'featured'
  | 'newest'
  | 'price-high-low'
  | 'price-low-high';

type Props = {
  appliedFilters?: AppliedFilter[];
  children: React.ReactNode;
  collections?: Array<{handle: string; title: string}>;
  filters: Filter[];
};
export const FILTER_URL_PREFIX = 'filter.';

export function SortFilter({
  appliedFilters = [],
  children,
  collections = [],
  filters,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="flex w-full items-center justify-between">
        <button
          className={
            'focus:ring-primary/5 relative flex size-8 items-center justify-center'
          }
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconFilters />
        </button>
        <SortMenu />
      </div>
      <div className="flex flex-col flex-wrap md:flex-row">
        <div
          className={`transition-all duration-200 ${
            isOpen
              ? 'max-h-full min-w-full opacity-100 md:w-[240px] md:min-w-[240px] md:pr-8'
              : 'max-h-0 pr-0 opacity-0 md:max-h-full md:w-[0px] md:min-w-[0px]'
          }`}
        >
          <FiltersDrawer appliedFilters={appliedFilters} filters={filters} />
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </>
  );
}

export function FiltersDrawer({
  appliedFilters = [],
  filters = [],
}: Omit<Props, 'children'>) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter: Filter, option: Filter['values'][0]) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter
          ? (JSON.parse(priceFilter) as ProductFilter['price'])
          : undefined;
        const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
        const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);

        return <PriceRangeFilter max={max} min={min} />;

      default:
        const to = getFilterLink(option.input as string, params, location);
        return (
          <Link
            className="hover:underline focus:underline"
            prefetch="intent"
            preventScrollReset
            replace
            to={to}
          >
            {option.label}
          </Link>
        );
    }
  };

  return (
    <>
      <nav className="py-8">
        {appliedFilters.length > 0 ? (
          <div className="pb-8">
            <AppliedFilters filters={appliedFilters} />
          </div>
        ) : null}

        <span className="text-lg">Filter By</span>
        <div className="divide-y">
          {filters.map((filter: Filter) => (
            <Disclosure as="div" className="w-full" key={filter.id}>
              {({open}) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between py-4">
                    <span>{filter.label}</span>
                    <CaretDownIcon />
                  </Disclosure.Button>
                  <Disclosure.Panel key={filter.id}>
                    <ul className="py-2" key={filter.id}>
                      {filter.values?.map((option) => {
                        return (
                          <li className="pb-4" key={option.id}>
                            {filterMarkup(filter, option)}
                          </li>
                        );
                      })}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </nav>
    </>
  );
}

function AppliedFilters({filters = []}: {filters: AppliedFilter[]}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      <span className="text-lg">Applied filters</span>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter: AppliedFilter) => {
          return (
            <Link
              className="gap flex rounded-full border px-2"
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
              preventScrollReset
              replace
              to={getAppliedFilterLink(filter, params, location)}
            >
              <span className="flex-grow">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

function getAppliedFilterLink(
  filter: AppliedFilter,
  params: URLSearchParams,
  location: Location,
) {
  const paramsClone = new URLSearchParams(params);
  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

function getSortLink(
  sort: SortParam,
  params: URLSearchParams,
  location: Location,
) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

function getFilterLink(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
  location: ReturnType<typeof useLocation>,
) {
  const paramsClone = new URLSearchParams(params);
  const newParams = filterInputToParams(rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

function PriceRangeFilter({max, min}: {max?: number; min?: number}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`, {
          preventScrollReset: true,
          replace: true,
        });
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`, {
        preventScrollReset: true,
        replace: true,
      });
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event: SyntheticEvent) => {
    const value = (event.target as HTMLInputElement).value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4">
        <span>from</span>
        <input
          className="text-black"
          name="minPrice"
          onChange={onChangeMin}
          placeholder={'$'}
          type="number"
          value={minPrice ?? ''}
        />
      </label>
      <label>
        <span>to</span>
        <input
          className="text-black"
          name="maxPrice"
          onChange={onChangeMax}
          placeholder={'$'}
          type="number"
          value={maxPrice ?? ''}
        />
      </label>
    </div>
  );
}

function filterInputToParams(
  rawInput: ProductFilter | string,
  params: URLSearchParams,
) {
  const input =
    typeof rawInput === 'string'
      ? (JSON.parse(rawInput) as ProductFilter)
      : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}

export default function SortMenu() {
  const items: {key: SortParam; label: string}[] = [
    {key: 'featured', label: 'Featured'},
    {
      key: 'price-low-high',
      label: 'Price: Low - High',
    },
    {
      key: 'price-high-low',
      label: 'Price: High - Low',
    },
    {
      key: 'best-selling',
      label: 'Best Selling',
    },
    {
      key: 'newest',
      label: 'Newest',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <Menu as="div" className="relative z-40">
      <Menu.Button className="flex items-center">
        <span className="px-2">
          <span className="px-2 font-medium">Sort by:</span>
          <span>{(activeItem || items[0]).label}</span>
        </span>
        <CaretDownIcon />
      </Menu.Button>

      <Menu.Items
        as="nav"
        className="absolute right-0 flex flex-col rounded-sm bg-white p-4 text-right"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                className={`block px-3 pb-2 text-sm ${
                  activeItem?.key === item.key ? 'font-bold' : 'font-normal'
                }`}
                preventScrollReset
                replace
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}
