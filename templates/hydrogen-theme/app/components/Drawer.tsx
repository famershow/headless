import {Dialog, Transition} from '@headlessui/react';
import {cx} from 'class-variance-authority';
import {Fragment, useState} from 'react';

import {IconClose} from './icons/IconClose';

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export function Drawer({
  children,
  heading,
  onClose,
  open,
  openFrom = 'right',
}: {
  children: React.ReactNode;
  heading?: string;
  onClose: () => void;
  open: boolean;
  openFrom: 'left' | 'right';
}) {
  const offScreen = {
    left: '-translate-x-full',
    right: 'translate-x-full',
  };

  return (
    <Transition appear as={Fragment} show={open}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 left-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-400/50 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={cx([
                'fixed inset-y-0 flex max-w-full',
                openFrom === 'right' ? 'right-0' : '',
              ])}
            >
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom={offScreen[openFrom]}
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo={offScreen[openFrom]}
              >
                <div className="max-h-screen w-screen max-w-lg bg-color-scheme-bg">
                  <Dialog.Panel className="flex max-h-screen min-h-full flex-col">
                    <header className="flex items-start justify-between p-5 shadow-sm">
                      {heading !== null && (
                        <Dialog.Title className="text-lg">
                          {heading}
                        </Dialog.Title>
                      )}
                      <button
                        className="text-primary hover:text-primary/50 -m-4 p-4 transition"
                        data-test="close-cart"
                        onClick={onClose}
                        type="button"
                      >
                        <IconClose aria-label="Close panel" />
                      </button>
                    </header>
                    {children}
                  </Dialog.Panel>
                </div>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

/* Use for associating arialabelledby with the title*/
Drawer.Title = Dialog.Title;

export function useDrawer(openDefault = false) {
  const [isOpen, setIsOpen] = useState(openDefault);

  function openDrawer() {
    setIsOpen(true);
  }

  function closeDrawer() {
    setIsOpen(false);
  }

  return {
    closeDrawer,
    isOpen,
    openDrawer,
  };
}
