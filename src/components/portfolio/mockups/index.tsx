import type { ComponentType } from "react";
import { TrovrMockup } from "./TrovrMockup";
import { MomoMockup } from "./MomoMockup";
import { StartupFilesMockup } from "./StartupFilesMockup";
import { JobSignalMockup } from "./JobSignalMockup";
import { ContentDeskMockup } from "./ContentDeskMockup";
import { BloomStudiosMockup } from "./BloomStudiosMockup";
import { ClosedAIMockup } from "./ClosedAIMockup";

export const mockupsByProjectId: Record<string, ComponentType> = {
  trovr: TrovrMockup,
  momo: MomoMockup,
  startupfiles: StartupFilesMockup,
  jobsignal: JobSignalMockup,
  contentdesk: ContentDeskMockup,
  "bloom-studios": BloomStudiosMockup,
  closedai: ClosedAIMockup,
};
