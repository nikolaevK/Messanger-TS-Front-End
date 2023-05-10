import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

export const theme = extendTheme(
  { config },
  {
    colors: {
      messageBlue: {
        100: "#3d84f7",
      },
    },
    styles: {
      global: () => ({
        body: {
          bg: "whiteAlpha.200",
        },
      }),
    },
  }
);
