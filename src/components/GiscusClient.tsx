"use client";
import Giscus from "@giscus/react";
import { useTheme } from "./ThemeProvider";

export default function GiscusClient(props: any) {
  const { dark } = useTheme();
  
  return (
    <Giscus 
      {...props} 
      theme={dark ? "dark" : "light"} 
    />
  );
}
