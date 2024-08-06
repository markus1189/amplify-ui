import React from 'react';
import { withBaseElementProps } from '@aws-amplify/ui-react-core/elements';

import type { OmitElements } from '../types';
import { StorageBrowserElements } from '../../context/elements';
import { CLASS_BASE } from '../constants';

const { Button } = StorageBrowserElements;

const BLOCK_NAME = `${CLASS_BASE}__refresh`;

export interface _StartActionControl<
  T extends StorageBrowserElements = StorageBrowserElements,
> {
  (): React.JSX.Element;
  Button: T['Button'];
}

export interface StartActionControl<
  T extends StorageBrowserElements = StorageBrowserElements,
> extends OmitElements<_StartActionControl<T>, 'Button'> {
  (): React.JSX.Element;
}

const StartActionButton = withBaseElementProps(Button, {
  className: `${BLOCK_NAME}`,
  variant: 'start-action',
});

export const StartActionControl: StartActionControl = () => (
  <StartActionButton />
);
