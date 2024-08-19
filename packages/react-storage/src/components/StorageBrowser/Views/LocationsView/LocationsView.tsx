import React from 'react';

import { StorageBrowserElements } from '../../context/elements';

import { CLASS_BASE } from '../constants';
import { Controls } from '../Controls';
import { CommonControl, ViewComponent } from '../types';
import { LocationsViewTable } from '../Controls';
import { useLocationsData } from '../../context/actions';

const { Message, Paginate, Refresh, Search, Table, Title } = Controls;

interface LocationsViewControls<
  T extends StorageBrowserElements = StorageBrowserElements,
  // exclude `Toggle` from `Search` for Locations List
> extends Exclude<
    Pick<Controls<T>, CommonControl | 'Paginate' | 'Refresh' | 'Search'>,
    Controls<T>['Search']['Toggle']
  > {
  (): React.JSX.Element;
}

export interface LocationsView<
  T extends StorageBrowserElements = StorageBrowserElements,
> extends ViewComponent<LocationsViewControls<T>> {}

const LocationsViewRefresh = () => {
  const [{ data, isLoading }, handleListLocations] = useLocationsData();

  return (
    <Refresh
      disabled={isLoading || data.result.length <= 0}
      onClick={() =>
        handleListLocations({
          options: { refresh: true, pageSize: 1000 },
        })
      }
    />
  );
};

export const LocationsMessage = (): React.JSX.Element | null => {
  const [{ hasError, message }] = useLocationsData();
  return hasError ? (
    <Message variant="error">
      {message ?? 'There was an error loading locations.'}
    </Message>
  ) : null;
};

const LocationsViewControls: LocationsViewControls = () => {
  return (
    <>
      <Title>Home</Title>
      <LocationsViewRefresh />
      <LocationsMessage />
      <LocationsViewTable />
    </>
  );
};

LocationsViewControls.Message = Message;
LocationsViewControls.Paginate = Paginate;
LocationsViewControls.Refresh = Refresh;
LocationsViewControls.Search = Search;
LocationsViewControls.Table = Table;
LocationsViewControls.Title = Title;

export const LocationsView: LocationsView = () => {
  return (
    <div className={CLASS_BASE} data-testid="LOCATIONS_VIEW">
      <LocationsViewControls />
    </div>
  );
};

LocationsView.Controls = LocationsViewControls;
