import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";
import { dataset, projectId } from "./src/sanity/env";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      event: {
        resource: {
          id: `${projectId}.${dataset}`,
          type: "dataset",
        },
      },
      name: "invalidate-tags",
    }),
  ],
});
