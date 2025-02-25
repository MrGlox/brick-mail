import { withNode } from "~/components/nodes/connector";

import { Button } from "../ui/button";

import { SettingsControl } from "~/containers/builder/settings-control";

const draggable = true;

export const NodeButton = withNode(Button, {
  draggable,
});

NodeButton.craft = {
  ...NodeButton.craft,
  related: {
    toolbar: SettingsControl,
  },
};
