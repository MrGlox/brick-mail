import { Editor, Frame, Element } from "@craftjs/core";

import { NodeButton } from "~/components/nodes/button";
import {
  NodeCardHeader,
  NodeCard,
  NodeCardContent,
  NodeCardDescription,
  NodeCardTitle,
  NodeCardFooter,
} from "~/components/nodes/card";
import { NodeOneBlock, NodeTwoBlocks } from "~/components/nodes/layout";
import { componentsMap } from "~/components/nodes/components-map";

import { SideMenu } from "~/containers/builder/side-menu";
import { Header } from "~/containers/builder/header";
import { Canvas } from "~/containers/builder/canvas";
import { ReactIframe } from "~/containers/builder/react-iframe";
import { ControlPanel } from "~/containers/builder/control-panel";
import { Viewport } from "~/containers/builder/viewport";
import { RenderNode } from "~/containers/builder/render-node";

export const loader = async ({ context }) => {
  // const user = await getOptionalUser({ context })

  // const newNotification = await context.remixService.notification.createNotification(user?.id || "");

  return {};
};

export default function Index() {
  return (
    <section className="w-full min-h-screen flex flex-col">
      <Header />
      <Editor
        resolver={{
          NodeButton,
          Canvas,
          NodeCardHeader,
          NodeCard,
          NodeCardContent,
          NodeCardDescription,
          NodeCardTitle,
          NodeCardFooter,
          NodeOneBlock,
          NodeTwoBlocks,
        }}
        onRender={RenderNode}
      >
        <div className="flex flex-1 relative overflow-hidden">
          <SideMenu componentsMap={componentsMap} />
          <Viewport>
            <ReactIframe
              title="my frame"
              className="p-4 w-full h-full page-container"
            >
              <Frame>
                <Element is={Canvas} id="ROOT" canvas>
                  <NodeButton>Button 1</NodeButton>
                  <NodeButton>Button 2</NodeButton>
                  <NodeButton>Button 3</NodeButton>
                  <NodeButton>Button 4</NodeButton>
                </Element>
              </Frame>
            </ReactIframe>
          </Viewport>

          <ControlPanel />
        </div>
      </Editor>
    </section>
  );
}
