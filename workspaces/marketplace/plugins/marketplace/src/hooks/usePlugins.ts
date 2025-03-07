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

import { useQuery } from '@tanstack/react-query';
import { marketplaceApiRef } from '../api';
import {
  GetPluginsRequest,
  convertSearchParamsToGetPluginsRequest,
} from '@red-hat-developer-hub/backstage-plugin-marketplace-common';

export const usePlugins = (params?: URLSearchParams) => {
  const marketplaceApi = useApi(marketplaceApiRef);
  const request: GetPluginsRequest =
    convertSearchParamsToGetPluginsRequest(params);
  return useQuery({
    queryKey: ['plugins', params],
    queryFn: () => marketplaceApi.getPlugins(request),
  });
};
