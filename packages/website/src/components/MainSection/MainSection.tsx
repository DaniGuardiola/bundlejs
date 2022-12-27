import type { Component, ComponentProps, JSX } from "solid-js";
import { onCleanup, onMount } from "solid-js";

import Container from "../Container";
import SearchContainer from "./SearchSection/SearchContainer";
import EditorSection from "./EditorSection/EditorSection";
import Analysis from "./Analysis";
import DragHandle from "./EditorSection/DragHandle";

export const KEYCODE = {
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  ESC: "Escape"
}

export function MainSection(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let editorRef: HTMLDivElement = null;

  let searchEl: HTMLDialogElement = null;
  let tabBarEl: HTMLDivElement = null;

  function onKeyUp(e?: KeyboardEvent) {
    switch (e.code) {
      case KEYCODE.ESC:
        if (searchEl?.open) 
          tabBarEl?.focus();
        break;
    }
  }

  // onMount(() => {
  //   searchEl = ref.querySelector('dialog') as unknown as (HTMLDialogElement & { open?: boolean });
  //   tabBarEl = editorRef.querySelector(".tab-bar button");
  // });

  // onCleanup(() => {
  //   searchEl = null;
  //   tabBarEl = null;
  // });

  return (
    <Container class="col h-full" max="full" ref={ref}>
      {/* <Container class="px-none">
      <SearchContainer onKeyUp={onKeyUp} />
    </Container> */}

      {/* <EditorSection ref={editorRef} /> */}
      <div class="bg-blue-300 h-[50%]"></div>

      <DragHandle drag-height direction="y" constrain={true} />

      <Analysis />
    </Container>
  );
}

export default MainSection;