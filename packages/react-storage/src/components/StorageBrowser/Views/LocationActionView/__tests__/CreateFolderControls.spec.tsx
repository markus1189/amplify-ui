import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';

import createProvider from '../../../createProvider';
import * as ActionsModule from '../../../context/actions';
import { DataState } from '@aws-amplify/ui-react-core';
import {
  isValidFolderName,
  CreateFolderControls,
  CreateFolderMessage,
  FIELD_VALIDATION_MESSAGE,
  RESULT_SUCCESS_MESSAGE,
  RESULT_ERROR_MESSAGE,
} from '../CreateFolderControls';
import { CreateFolderActionOutput } from '../../../context/actions/createFolderAction';

const useActionSpy = jest.spyOn(ActionsModule, 'useAction');

const listLocations = jest.fn(() =>
  Promise.resolve({ locations: [], nextToken: undefined })
);

const config = {
  getLocationCredentials: jest.fn(),
  listLocations,
  region: 'region',
  registerAuthListener: jest.fn(),
};
const Provider = createProvider({ config });

describe('CreateFolderActionView', () => {
  it('renders a CreateFolderActionView', async () => {
    await waitFor(() => {
      expect(
        render(
          <Provider>
            <CreateFolderControls />
          </Provider>
        ).container
      ).toBeDefined();
    });
  });

  it('handles folder creation in the happy path', async () => {
    const handleAction = jest.fn();
    useActionSpy.mockReturnValue([
      {
        isLoading: false,
        data: { result: undefined },
        message: undefined,
        hasError: false,
      },
      handleAction,
    ]);

    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderControls />
        </Provider>
      );
    });

    const input = screen.getByLabelText('Enter folder name:');
    fireEvent.change(input, { target: { value: 'test-folder-name' } });

    const button = screen.getByRole('button', { name: 'Create Folder' });

    fireEvent.click(button);

    const fieldError = screen.queryByText(FIELD_VALIDATION_MESSAGE);

    expect(fieldError).toBe(null);
    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleAction).toHaveBeenCalledWith({ prefix: 'test-folder-name/' });
  });

  it('shows a field error when invalid folder name is entered', async () => {
    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderControls />
        </Provider>
      );
    });

    const input = screen.getByLabelText('Enter folder name:');
    fireEvent.change(input, { target: { value: 'invalid/folder-name' } });
    fireEvent.blur(input);

    const fieldError = screen.getByText(FIELD_VALIDATION_MESSAGE);
    expect(fieldError).toBeInTheDocument();
  });

  it('clears a field error as expected', async () => {
    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderControls />
        </Provider>
      );
    });

    const input = screen.getByLabelText('Enter folder name:');
    fireEvent.change(input, { target: { value: 'invalid/folder-name' } });
    fireEvent.blur(input);

    const initialFieldError = screen.queryByText(FIELD_VALIDATION_MESSAGE);
    expect(initialFieldError).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'valid-folder-name' } });
    fireEvent.blur(input);

    const fieldError = screen.queryByText(FIELD_VALIDATION_MESSAGE);
    expect(fieldError).not.toBeInTheDocument();
  });

  it('cleans up on exit', async () => {
    const handleAction = jest.fn();
    useActionSpy.mockReturnValue([
      {
        isLoading: false,
        data: { result: undefined },
        message: undefined,
        hasError: false,
      },
      handleAction,
    ]);

    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderControls />
        </Provider>
      );
    });

    const button = screen.getByRole('button', { name: 'Back' });

    fireEvent.click(button);

    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleAction).toHaveBeenCalledWith({
      options: { reset: true },
      prefix: '',
    });
  });

  it('shows a success message when result is SUCCESS', async () => {
    const useActionSpy = jest.spyOn(ActionsModule, 'useAction');
    const handleUpdateActionState = jest.fn();

    const createFolderActionState: DataState<CreateFolderActionOutput> = {
      data: { result: { key: 'test', status: 'SUCCESS', message: undefined } },
      hasError: false,
      isLoading: false,
      message: undefined,
    };

    useActionSpy.mockReturnValue([
      createFolderActionState,
      handleUpdateActionState,
    ]);

    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderMessage />
        </Provider>
      );
    });

    const successMessage = screen.getByText(RESULT_SUCCESS_MESSAGE);

    expect(successMessage).toBeInTheDocument();

    useActionSpy.mockClear();
    handleUpdateActionState.mockClear();
  });
  it('shows an error message when result is ERROR', async () => {
    const useActionSpy = jest.spyOn(ActionsModule, 'useAction');
    const handleUpdateActionState = jest.fn();

    const createFolderActionState: DataState<CreateFolderActionOutput> = {
      data: { result: { key: 'test', status: 'ERROR', message: undefined } },
      hasError: false,
      isLoading: false,
      message: undefined,
    };

    useActionSpy.mockReturnValue([
      createFolderActionState,
      handleUpdateActionState,
    ]);

    await waitFor(() => {
      render(
        <Provider>
          <CreateFolderMessage />
        </Provider>
      );
    });

    const successMessage = screen.getByText(RESULT_ERROR_MESSAGE);

    expect(successMessage).toBeInTheDocument();

    useActionSpy.mockClear();
    handleUpdateActionState.mockClear();
  });
});

describe('isValidFolderName', () => {
  it('returns false when value is undefined', () => {
    expect(isValidFolderName(undefined)).toBe(false);
  });

  it('returns false when value is an empty string', () => {
    expect(isValidFolderName('')).toBe(false);
  });

  it('returns false if value contains a slash', () => {
    expect(isValidFolderName('Fruit/Kiwi')).toBe(false);
  });

  it('returns true for isValidFolderName when name is valid', () => {
    expect(isValidFolderName('Kiwi')).toBe(true);
  });
});
