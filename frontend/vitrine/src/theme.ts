import { createTheme, rem } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "Work Sans, sans-serif",
  headings: {
    fontFamily: "Urbanist, sans-serif",
    fontWeight: "700",
    sizes: {
      h1: { fontSize: rem(36), lineHeight: "1.25" },
      h2: { fontSize: rem(32), lineHeight: "1.3" },
      h3: { fontSize: rem(28), lineHeight: "1.35" },
      h4: { fontSize: rem(24), lineHeight: "1.4" },
      h5: { fontSize: rem(20), lineHeight: "1.45" },
      h6: { fontSize: rem(16), lineHeight: "1.5" },
    },
  },

  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(15),
    lg: rem(16),
    xl: rem(18),
  },

  colors: {
    // 🟠 Orange principal – pour branding et accents
    shopOrange: [
      "#FFF3E6",
      "#FFE0BF",
      "#FFC999",
      "#FFB273",
      "#FF993F",
      "#FF7F00",
      "#E66A00",
      "#B35400",
      "#804000",
      "#4D2800",
    ],

    // 🟢 Vert promotion – pour boutons d’action et badges
    shopGreen: [
      "#E6FAF0",
      "#C1F3D9",
      "#91EABF",
      "#63E1A5",
      "#39D88B",
      "#22C871",
      "#179858",
      "#0E673F",
      "#074526",
      "#032312",
    ],

    // ⚪ Neutres pour fonds et textes
    neutral: [
      "#FFFFFF",
      "#F8F8F8",
      "#EFEFEF",
      "#E0E0E0",
      "#CFCFCF",
      "#B0B0B0",
      "#8E8E8E",
      "#6B6B6B",
      "#474747",
      "#2A2A2A",
    ],

    // 🔵 Bleu secondaire – pour hover et accents
    shopBlue: [
      "#E6F0FA",
      "#C3DAF5",
      "#99C1EF",
      "#70A8E9",
      "#4D90E3",
      "#2C78DE",
      "#1F5BAF",
      "#154281",
      "#0C2A54",
      "#051427",
    ],
  },

  primaryColor: "shopOrange",

  components: {
    Paper: {
      defaultProps: {
        withBorder: true,
        shadow: "sm",
        radius: "md",
      },
    },
    Button: {
      defaultProps: {
        variant: "filled",
        radius: "lg",
        color: "shopGreen", // CTA principale
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    ThemeIcon: {
      defaultProps: {
        variant: "light",
        color: "shopOrange",
        radius: "xl",
      },
    },
    ActionIcon: {
      defaultProps: {
        variant: "light",
        color: "shopBlue",
        radius: "xl",
      },
    },
  },

  defaultGradient: {
    from: "shopOrange.5",
    to: "shopGreen.5",
    deg: 120,
  },

  defaultRadius: "md",
});
