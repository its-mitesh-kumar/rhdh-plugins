## API Report File for "@red-hat-developer-hub/backstage-plugin-global-header"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { BackstagePlugin } from '@backstage/core-plugin-api';
import { JSX as JSX_2 } from 'react';

// @public
export const GlobalHeader: () => JSX_2.Element;

// @public
export const globalHeaderPlugin: BackstagePlugin<{}, {}, {}>;

// @public
export const NotificationBanner: (
  props: NotificationBannerProps,
) => JSX_2.Element | null;

// @public (undocumented)
export type NotificationBannerDismiss = 'none' | 'session' | 'localstorage';

// @public (undocumented)
export interface NotificationBannerProps {
  // (undocumented)
  backgroundColor?: string;
  // (undocumented)
  border?: string;
  // (undocumented)
  borderRadius?: string;
  // (undocumented)
  dismiss?: NotificationBannerDismiss;
  // (undocumented)
  id?: string;
  // (undocumented)
  markdown?: boolean;
  // (undocumented)
  textColor?: string;
  // (undocumented)
  title: string;
}

// (No @packageDocumentation comment for this package)
```
