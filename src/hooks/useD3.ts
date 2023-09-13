import { useEffect, useRef } from "react";
import * as d3 from "d3";

export const useD3 = (render: any, dependencies: any) => {
  const ref = useRef<any>();

  useEffect(() => {
    render(d3.select(ref.current));
    return () => {};
  }, dependencies);
  return ref;
};
