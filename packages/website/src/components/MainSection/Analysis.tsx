import type { ComponentProps, JSX } from "solid-js";
import Details from "../Details";
import Loading from "../Loading";
import DragHandle from "./EditorSection/DragHandle";

export function Analysis(props?: ComponentProps<'details'>) {
  return (
    <div class="analysis-section bg-red-700 w-full flex flex-col">
      <p class={"px-4 py-2 cursor-pointer select-none"}>Analysis</p>
      {props.children}
      <div class="relative w-full h-full min-h-0 overflow-hidden">
        <div class="analysis-loader">
          <div class="text-center">
            <Loading show={false}></Loading>

            <p class="loader-content">Nothing to analyze...</p>
          </div>
        </div>
        <iframe
          class="analysis-iframe"
          title="Bundle Analysis"
          id="analyzer"
          src="about:blank"
          sandbox="allow-scripts"
        ></iframe>
      </div>
    </div>
  );
}

export default Analysis;