import { ModuleTree, ModuleTreeLeaf, SizeKey } from "../../types/types";
import { HierarchyRectangularNode } from "d3";
import { SideBar } from "../sidebar";
import { Chart } from "./chart";
import { StaticContext } from "./index";
import { useFilter } from "../use-filter";
import { isModuleTree } from "../../utils/is-module-tree";
import { Component, useContext, createMemo, createSignal } from "solid-js";

export const Main: Component = () => {
  const { availableSizeProperties, rawHierarchy, getModuleSize, layout, data } = useContext(StaticContext);
  const [sizeProperty, setSizeProperty] = createSignal<SizeKey>(availableSizeProperties[0]);
  const [selectedNode, setSelectedNode] = createSignal<HierarchyRectangularNode<ModuleTree | ModuleTreeLeaf> | undefined>(
    undefined
  );

  const { getModuleFilterMultiplier, setExcludeFilter, setIncludeFilter } = useFilter();

  console.time("getNodeSizeMultiplier");
  const getNodeSizeMultiplier = createMemo(() => {
    const rootSize = getModuleSize(rawHierarchy.data, sizeProperty());
    const selectedSize = selectedNode() ? getModuleSize(selectedNode().data, sizeProperty()) : 1;
    const multiplier = rootSize * 0.2 > selectedSize ? (rootSize * 0.2) / selectedSize : 3;
    if (selectedNode() === undefined) {
      return (): number => 1;
    } else if (isModuleTree(selectedNode().data)) {
      const leaves = new Set(selectedNode().leaves().map((d) => d.data));
      return (node: ModuleTree | ModuleTreeLeaf): number => {
        if (leaves.has(node)) {
          return multiplier;
        }
        return 1;
      };
    } else {
      return (node: ModuleTree | ModuleTreeLeaf): number => {
        if (node === selectedNode().data) {
          return multiplier;
        }
        return 1;
      };
    }
  });
  console.timeEnd("getNodeSizeMultiplier");

  console.time("root hierarchy compute");
  // root here always be the same as rawHierarchy even after layouting
  const root = createMemo(() => {
    const rootWithSizesAndSorted = rawHierarchy
      .sum((node) => {
        if (isModuleTree(node)) return 0;
        const ownSize = getModuleSize(node, sizeProperty());
        const zoomMultiplier = getNodeSizeMultiplier()(node);
        const filterMultiplier = getModuleFilterMultiplier(data.nodeMetas[data.nodeParts[node.uid].mainUid]);

        return ownSize * zoomMultiplier * filterMultiplier;
      })
      .sort((a, b) => getModuleSize(a.data, sizeProperty()) - getModuleSize(b.data, sizeProperty()));

    return layout(rootWithSizesAndSorted);
  });

  console.timeEnd("root hierarchy compute");

  return (
    <>
      <SideBar
        sizeProperty={sizeProperty()}
        availableSizeProperties={availableSizeProperties}
        setSizeProperty={setSizeProperty}
        onExcludeChange={setExcludeFilter}
        onIncludeChange={setIncludeFilter}
      />
      <Chart root={root()} sizeProperty={sizeProperty()} selectedNode={selectedNode()} setSelectedNode={setSelectedNode} />
    </>
  );
};
