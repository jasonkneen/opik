import React, { useState } from "react";
import {
  Construction,
  FlaskConical,
  InspectionPanel,
  MousePointer,
} from "lucide-react";
import useAppStore from "@/store/AppStore";
import SideDialog from "@/components/shared/SideDialog/SideDialog";
import FrameworkIntegrations from "@/components/pages-shared/onboarding/FrameworkIntegrations/FrameworkIntegrations";
import AddExperimentDialog from "@/components/pages-shared/experiments/AddExperimentDialog/AddExperimentDialog";
import { Link } from "@tanstack/react-router";
import { SheetTitle } from "@/components/ui/sheet";
import { useIsFeatureEnabled } from "@/components/feature-toggles-provider";
import SetGuardrailDialog from "../HomePageShared/SetGuardrailDialog";
import { FeatureToggleKeys } from "@/types/feature-toggles";

const GetStartedSection = () => {
  const workspaceName = useAppStore((state) => state.activeWorkspaceName);
  const [isNewExperimentDialogOpened, setIsNewExperimentDialogOpened] =
    useState<boolean>(false);
  const [isGuardrailsDialogOpened, setIsGuardrailsDialogOpened] =
    useState<boolean>(false);
  const [isLogTraceDialogOpened, setIsLogTraceDialogOpened] = useState(false);
  const isGuardrailsEnabled = useIsFeatureEnabled(
    FeatureToggleKeys.GUARDRAILS_ENABLED,
  );

  const openNewExperimentDialog = () => setIsNewExperimentDialogOpened(true);
  const openLogTraceDialog = () => setIsLogTraceDialogOpened(true);
  const openGuardrailsDialog = () => setIsGuardrailsDialogOpened(true);

  return (
    <div>
      <h2 className="comet-title-s sticky top-0 z-10 truncate break-words bg-soft-background pb-3 pt-2">
        Get started
      </h2>
      <div className="flex gap-x-4">
        <div
          onClick={openLogTraceDialog}
          className="flex w-full max-w-[300px] cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex size-[24px] items-center justify-center rounded bg-[#DAFBF0] ">
            <InspectionPanel className="size-3.5 text-[#295747]" />
          </div>
          <div className="comet-body-s">Log a trace</div>
        </div>
        <div
          onClick={openNewExperimentDialog}
          className="flex w-full max-w-[300px] cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex size-[24px] items-center justify-center rounded bg-[#FDE2F6] ">
            <MousePointer className="size-3.5 text-[#72275F]" />
          </div>
          <div className="comet-body-s">Run an experiment</div>
        </div>
        {isGuardrailsEnabled && (
          <div
            onClick={openGuardrailsDialog}
            className="flex w-full max-w-[300px] cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-shadow hover:shadow-md"
          >
            <div className="flex size-[24px] items-center justify-center rounded bg-[#FEE3D7] ">
              <Construction className="size-3.5 text-[#73422B]" />
            </div>
            <div className="comet-body-s">Set a guardrail</div>
          </div>
        )}
        <Link
          className="flex w-full max-w-[300px] cursor-pointer items-center gap-3 rounded-md border bg-white p-4 transition-shadow hover:shadow-md"
          to={"/$workspaceName/playground"}
          params={{ workspaceName }}
        >
          <div className="flex size-[24px] items-center justify-center rounded bg-[#EFE2FD] ">
            <FlaskConical className="size-3.5 text-[#491B7E]" />
          </div>
          <div className="comet-body-s">Try out playground</div>
        </Link>
      </div>

      <SideDialog
        open={isLogTraceDialogOpened}
        setOpen={setIsLogTraceDialogOpened}
      >
        <div className="flex w-full min-w-fit flex-col pb-12">
          <div className="pb-8">
            <SheetTitle>Log a trace</SheetTitle>
            <div className="comet-body-s m-auto mt-4 w-[468px] self-center text-center text-muted-slate">
              Select a framework and follow the instructions to integrate Comet
              with your code, or explore our ready-to-run examples on the right
            </div>
          </div>
          <FrameworkIntegrations />
        </div>
      </SideDialog>

      <AddExperimentDialog
        open={isNewExperimentDialogOpened}
        setOpen={setIsNewExperimentDialogOpened}
      />
      {isGuardrailsEnabled && (
        <SetGuardrailDialog
          open={isGuardrailsDialogOpened}
          setOpen={setIsGuardrailsDialogOpened}
        />
      )}
    </div>
  );
};

export default GetStartedSection;
