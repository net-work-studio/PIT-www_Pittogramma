import { DashboardIcon } from "@sanity/icons/Dashboard";
import { LaunchIcon } from "@sanity/icons/Launch";
import { Button, Card, Container, Stack, Text } from "@sanity/ui";
import type { Tool } from "sanity";

export const umamiAnalyticsDashboardUrl =
  "https://umami.net-work.studio/share/J5nDBevseNbBXPzd";

function AnalyticsTool() {
  return (
    <Container padding={4} width={1}>
      <Card border padding={5} radius={2}>
        <Stack gap={4}>
          <Stack gap={3}>
            <Text size={3} weight="semibold">
              Analytics
            </Text>
            <Text muted>View Pittogramma's Umami analytics dashboard.</Text>
          </Stack>
          <div>
            <Button
              as="a"
              href={umamiAnalyticsDashboardUrl}
              icon={LaunchIcon}
              rel="noreferrer"
              target="_blank"
              text="Open Umami dashboard"
              tone="primary"
            />
          </div>
        </Stack>
      </Card>
    </Container>
  );
}

export const analyticsTool: Tool = {
  component: AnalyticsTool,
  icon: DashboardIcon,
  name: "analytics",
  title: "Analytics",
};
