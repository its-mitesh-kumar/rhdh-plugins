/*
 * Copyright Red Hat, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useApi } from '@backstage/core-plugin-api';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { mockGetRepositories } from '../../mocks/mockData';
import DeleteRepositoryDialog from './DeleteRepositoryDialog';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn(),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for testing
      },
    },
  });
let queryClient: QueryClient;
beforeEach(() => {
  queryClient = createTestQueryClient();
});

describe('DeleteRepositoryDialog', () => {
  it('renders delete repository dialog correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteRepositoryDialog
          open
          closeDialog={jest.fn()}
          repository={mockGetRepositories.repositories[0]}
        />
      </QueryClientProvider>,
    );
    expect(
      screen.queryByText(/Remove cupcake repository?/i),
    ).toBeInTheDocument();
    const deleteButton = screen.getByRole('button', { name: /Remove/i });
    expect(deleteButton).toBeEnabled();
  });

  it('does not render when not open', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteRepositoryDialog
          open={false}
          closeDialog={jest.fn()}
          repository={mockGetRepositories.repositories[0]}
        />
      </QueryClientProvider>,
    );
    expect(
      screen.queryByText(/Remove cupcake repository?/i),
    ).not.toBeInTheDocument();
  });

  it('should show an error if repository url is missing', async () => {
    const repo = {
      ...mockGetRepositories.repositories[0],
      repoUrl: '',
      url: '',
    };

    render(
      <QueryClientProvider client={queryClient}>
        <DeleteRepositoryDialog
          open
          closeDialog={jest.fn()}
          repository={repo}
        />
      </QueryClientProvider>,
    );
    expect(
      screen.queryByText(/Remove cupcake repository?/i),
    ).toBeInTheDocument();
    const deleteButton = screen.getByText('Remove');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(
        screen.queryByText(
          'Cannot remove repository as the repository URL is missing.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('shows an error when the deletion fails', async () => {
    const mockDeleteRepository = jest.fn().mockRejectedValue('Error occured');
    const useApiMock = useApi as jest.Mock;
    useApiMock.mockReturnValue({
      deleteImportAction: mockDeleteRepository,
    });
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteRepositoryDialog
          open
          closeDialog={jest.fn()}
          repository={mockGetRepositories.repositories[0]}
        />
      </QueryClientProvider>,
    );

    const deleteButton = screen.getByText('Remove');
    fireEvent.click(deleteButton);
    await waitFor(() => {
      expect(
        screen.queryByText('Unable to remove repository. Error occured'),
      ).toBeInTheDocument();
      expect(deleteButton).toBeDisabled();
    });
  });
});
