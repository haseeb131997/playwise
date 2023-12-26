import { Appearance } from "react-native";

export const Colors = {
  primary: "#F06A21",
  secondary: "#FFE6E0",
  gradientPack: ["#F12422", "#F14722", "#F16B22", "#F29923"],
  third: "",
  facebook: "#3b5998",
  discord: "#7289da",
  instagram: "#e1306c",
  youtube: "#ff0000",
  linkedin: "#0077b5",
  pageBackground: Appearance.getColorScheme() == "dark" ? "black" : "white",
};

export const getDarkTheme = {
  backgroundColor: "#121212",
  color: "#fff",
};
export const inputDarkTheme = {
  backgroundColor: "#FFE6E0",
  color: "grey",
};

export const getLightTheme = {
  backgroundColor: "#ffff",
  color: "#000",
};
