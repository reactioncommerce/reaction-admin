import { registerComponent } from "@reactioncommerce/reaction-components";

import "./containers"; // For registering `ProductPublish`

import { Divider } from "/imports/plugins/core/ui/client/components";

// Register PDP components and some others
registerComponent("Divider", Divider);
