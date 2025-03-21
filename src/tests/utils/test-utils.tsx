
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProviders } from '@/context';

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AppProviders, ...options });

// re-export everything
export * from '@testing-library/react';
export { customRender as render };
