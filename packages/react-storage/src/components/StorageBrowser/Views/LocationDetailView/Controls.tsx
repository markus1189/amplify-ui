import React from 'react';

import { StorageBrowserElements } from '../../context/elements';
import { useControl } from '../../context/controls';
import { Controls, LocationDetailViewTable } from '../Controls';
import { CommonControl } from '../types';
import { useAction } from '../../context/actions';

const { ActionSelect, Navigate, Refresh, Title: TitleElement } = Controls;

export interface LocationDetailViewControls<
  T extends StorageBrowserElements = StorageBrowserElements,
> extends Pick<
    Controls<T>,
    CommonControl | 'Title' | 'ActionSelect' | 'Paginate' | 'Refresh' | 'Search'
  > {
  (): React.JSX.Element;
}

export const Title = (): React.JSX.Element => {
  const [{ history }] = useControl({ type: 'NAVIGATE' });
  const { prefix } = history.slice(-1)[0];
  return <TitleElement>{prefix}</TitleElement>;
};

const LocationDetailViewRefresh = () => {
  const [{ path }] = useControl({ type: 'NAVIGATE' });

  const [{ data, isLoading }, handleList] = useAction({
    type: 'LIST_LOCATION_ITEMS',
  });

  return (
    <Refresh
      disabled={isLoading || data.result.length <= 0}
      onClick={() =>
        handleList({ prefix: path, options: { refresh: true, pageSize: 1000 } })
      }
    />
  );
};

// @ts-expect-error TODO: add Controls assignment
export const LocationDetailViewControls: LocationDetailViewControls = () => {
  return (
    <>
      <Navigate />
      <Title />
      <LocationDetailViewRefresh />
      <ActionSelect />
      <LocationDetailViewTable />
    </>
  );
};
