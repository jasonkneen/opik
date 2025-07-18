import React, { useCallback } from "react";
import get from "lodash/get";
import isNumber from "lodash/isNumber";
import { StringParam, useQueryParam } from "use-query-params";
import { Clock, Coins, Hash, PenLine } from "lucide-react";

import { AgentGraphData, Span, Trace } from "@/types/traces";
import {
  METADATA_AGENT_GRAPH_KEY,
  TRACE_TYPE_FOR_TREE,
} from "@/constants/traces";
import BaseTraceDataTypeIcon from "../BaseTraceDataTypeIcon";
import TooltipWrapper from "@/components/shared/TooltipWrapper/TooltipWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TagList from "../TagList/TagList";
import InputOutputTab from "./InputOutputTab";
import MetadataTab from "./MatadataTab";
import FeedbackScoreTab from "./FeedbackScoreTab";
import AgentGraphTab from "./AgentGraphTab";
import { formatDuration } from "@/lib/date";
import isUndefined from "lodash/isUndefined";
import { formatCost } from "@/lib/money";
import TraceDataViewerActionsPanel from "@/components/pages-shared/traces/TraceDetailsPanel/TraceDataViewer/TraceDataViewerActionsPanel";
import {
  DetailsActionSection,
  DetailsActionSectionValue,
} from "@/components/pages-shared/traces/DetailsActionSection";
import TraceDataViewerHeader from "./TraceDataViewerHeader";
import { EXPLAINER_ID, EXPLAINERS_MAP } from "@/constants/explainers";
import ExplainerIcon from "@/components/shared/ExplainerIcon/ExplainerIcon";
import useTraceFeedbackScoreDeleteMutation from "@/api/traces/useTraceFeedbackScoreDeleteMutation";

type TraceDataViewerProps = {
  graphData?: AgentGraphData;
  data: Trace | Span;
  projectId: string;
  traceId: string;
  spanId?: string;
  activeSection: DetailsActionSectionValue | null;
  setActiveSection: (v: DetailsActionSectionValue) => void;
  isSpansLazyLoading: boolean;
  search?: string;
};

const TraceDataViewer: React.FunctionComponent<TraceDataViewerProps> = ({
  graphData,
  data,
  projectId,
  traceId,
  spanId,
  activeSection,
  setActiveSection,
  isSpansLazyLoading,
  search,
}) => {
  const type = get(data, "type", TRACE_TYPE_FOR_TREE);
  const tokens = data.usage?.total_tokens;

  const agentGraphData = get(
    data,
    ["metadata", METADATA_AGENT_GRAPH_KEY],
    null,
  );
  const hasSpanAgentGraph =
    Boolean(agentGraphData) && type !== TRACE_TYPE_FOR_TREE;

  const [tab = "input", setTab] = useQueryParam("traceTab", StringParam, {
    updateType: "replaceIn",
  });

  const selectedTab = tab === "graph" && !hasSpanAgentGraph ? "input" : tab;

  const isSpanInputOutputLoading =
    type !== TRACE_TYPE_FOR_TREE && isSpansLazyLoading;
  const entityName = type === TRACE_TYPE_FOR_TREE ? "trace" : "span";

  const feedbackScoreDeleteMutation = useTraceFeedbackScoreDeleteMutation();

  const onDeleteFeedbackScore = useCallback(
    (name: string) => {
      feedbackScoreDeleteMutation.mutate({
        traceId,
        spanId,
        name,
      });
    },
    [traceId, spanId, feedbackScoreDeleteMutation],
  );

  return (
    <div className="size-full max-w-full overflow-auto">
      {graphData && (
        <div className="h-72 min-w-[400px] max-w-full overflow-x-hidden border-b p-4">
          <AgentGraphTab data={graphData} />
        </div>
      )}
      <div className="min-w-[400px] max-w-full overflow-x-hidden p-4">
        <div className="mb-6 flex flex-col gap-1">
          <TraceDataViewerHeader
            title={
              <>
                <BaseTraceDataTypeIcon type={type} />
                <div
                  data-testid="data-viewer-title"
                  className="comet-title-xs truncate"
                >
                  {data?.name}
                </div>
              </>
            }
            actionsPanel={(layoutSize) => (
              <TraceDataViewerActionsPanel
                data={data}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                layoutSize={layoutSize}
              />
            )}
          />
          <div className="comet-body-s-accented flex w-full items-center gap-3 overflow-x-hidden text-muted-slate">
            <TooltipWrapper content="Duration in seconds">
              <div
                data-testid="data-viewer-duration"
                className="flex items-center gap-2 px-1"
              >
                <Clock className="size-4 shrink-0" />
                {formatDuration(data.duration)}
              </div>
            </TooltipWrapper>
            {isNumber(tokens) && (
              <TooltipWrapper content="Total amount of tokens">
                <div
                  data-testid="data-viewer-tokens"
                  className="flex items-center gap-2 px-1"
                >
                  <Hash className="size-4 shrink-0" />
                  {tokens} tokens
                </div>
              </TooltipWrapper>
            )}
            {Boolean(data.feedback_scores?.length) && (
              <TooltipWrapper content="Number of feedback scores">
                <div
                  data-testid="data-viewer-scores"
                  className="flex items-center gap-2 px-1"
                >
                  <PenLine className="size-4 shrink-0" />
                  {data.feedback_scores?.length} feedback scores
                </div>
              </TooltipWrapper>
            )}
            {!isUndefined(data.total_estimated_cost) && (
              <TooltipWrapper content="Estimated cost">
                <div
                  data-testid="data-viewer-scores"
                  className="flex items-center gap-2 break-all px-1"
                >
                  <Coins className="size-4 shrink-0" />
                  {formatCost(data.total_estimated_cost)}
                </div>
              </TooltipWrapper>
            )}
          </div>
          <TagList
            data={data}
            tags={data.tags}
            projectId={projectId}
            traceId={traceId}
            spanId={spanId}
          />
        </div>

        <Tabs defaultValue="input" value={selectedTab!} onValueChange={setTab}>
          <TabsList variant="underline">
            <TabsTrigger variant="underline" value="input">
              Input/Output
            </TabsTrigger>
            <TabsTrigger variant="underline" value="feedback_scores">
              Feedback scores
              <ExplainerIcon
                className="ml-1"
                {...EXPLAINERS_MAP[EXPLAINER_ID.what_are_feedback_scores]}
              />
            </TabsTrigger>
            <TabsTrigger variant="underline" value="metadata">
              Metadata
            </TabsTrigger>
            {hasSpanAgentGraph && (
              <TabsTrigger variant="underline" value="graph">
                Agent graph
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="input">
            <InputOutputTab
              data={data}
              isLoading={isSpanInputOutputLoading}
              search={search}
            />
          </TabsContent>
          <TabsContent value="feedback_scores">
            <FeedbackScoreTab
              feedbackScores={data.feedback_scores}
              onDeleteFeedbackScore={onDeleteFeedbackScore}
              entityName={entityName}
              onAddHumanReview={() =>
                setActiveSection(DetailsActionSection.Annotations)
              }
              entityType="trace"
            />
          </TabsContent>
          <TabsContent value="metadata">
            <MetadataTab data={data} search={search} />
          </TabsContent>
          {hasSpanAgentGraph && (
            <TabsContent value="graph">
              <AgentGraphTab data={agentGraphData} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default TraceDataViewer;
