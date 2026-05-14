import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";
import { dataset, projectId } from "./src/sanity/env";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: "invalidate-tags",
      event: {
        resource: {
          type: "dataset",
          id: `${projectId}.${dataset}`,
        },
      },
    }),
  ],
});
