import { ComponentProps, mergeProps, ParentProps, splitProps } from "solid-js";

export function Button(props: ParentProps<ComponentProps<'button'>>) {
  let [newProps, attrs] = splitProps(props, ["type", "children"]);
  let mergedProps = mergeProps({ type: "button" }, newProps)

  return (
    <button type={mergedProps.type as "button" | "submit" | "reset"} {...attrs} custom-button>
      {mergedProps.children}
    </button>
  );
}

export default Button;