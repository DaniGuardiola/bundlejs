import type { Component, ComponentProps } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

import DragHandle from "./DragHandle";

import Activity from "./Activity";
import Console from "./Console";

import Editor from "./Editor";
import Tabs from "./Tabs";

export function EditorSection(props?: ComponentProps<"div">) {
  const [direction, setDirection] = createSignal<"x" | "y">("x");
  
  function onResize(e: MediaQueryListEvent | MediaQueryList) {
    setDirection(e?.matches ? "x" : "y");
  }

  onMount(() => {
    const mediaQuery = globalThis?.matchMedia?.("(min-width: 640px)");
    onResize(mediaQuery);
    mediaQuery?.addEventListener?.("change", onResize);

    onCleanup(() => {
      mediaQuery?.removeEventListener?.("change", onResize);
    });
  });

  return (
    <div class="px-none editor-section" {...props}>
      <Tabs />
      <Activity />

      <div class="core">
        <Editor />
        <DragHandle direction={direction()} constrain={direction() == "x"} />
        <Console />
      </div>
    </div>
  );
}

export default EditorSection;