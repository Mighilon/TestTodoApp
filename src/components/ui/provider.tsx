"use client";

import {
  ChakraProvider,
  createSystem,
  defaultConfig,
  defaultSystem,
} from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const customSystem = createSystem(defaultConfig, {
  globalCss: {}, // Empty global styles
  preflight: false, // Disable CSS reset/preflight
});
const minimalSystem = createSystem(defaultConfig, {
  preflight: false,
  globalCss: {},
  theme: {
    ...defaultConfig.theme,
    tokens: {
      ...defaultConfig.theme?.tokens,
      // Keep tokens but remove global styles
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={minimalSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
