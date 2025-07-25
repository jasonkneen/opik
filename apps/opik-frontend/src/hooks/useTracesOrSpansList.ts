import {
  keepPreviousData,
  QueryObserverResult,
  RefetchOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import isBoolean from "lodash/isBoolean";

import useTracesList from "@/api/traces/useTracesList";
import useSpansList from "@/api/traces/useSpansList";
import { Span, Trace } from "@/types/traces";
import { Filters } from "@/types/filters";
import { Sorting } from "@/types/sorting";

export enum TRACE_DATA_TYPE {
  traces = "traces",
  spans = "spans",
}

type UseTracesOrSpansListParams = {
  projectId: string;
  type: TRACE_DATA_TYPE;
  filters?: Filters;
  sorting?: Sorting;
  search?: string;
  page: number;
  size: number;
  truncate?: boolean;
};

type UseTracesOrSpansListResponse = {
  data: {
    content: Array<Trace | Span>;
    sortable_by: string[];
    total: number;
  };
  isPending: boolean;
  isLoading: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<unknown, unknown>>;
};

export default function useTracesOrSpansList(
  params: UseTracesOrSpansListParams,
  config: Omit<UseQueryOptions, "queryKey" | "queryFn">,
) {
  const isTracesData = params.type === TRACE_DATA_TYPE.traces;
  const isEnabled = isBoolean(config.enabled) ? config.enabled : true;

  const {
    data: tracesData,
    isError: isTracesError,
    isPending: isTracesPending,
    isLoading: isTracesLoading,
    refetch: refetchTrace,
  } = useTracesList(params, {
    ...config,
    enabled: isTracesData && isEnabled,
    placeholderData: keepPreviousData,
  } as never);

  const {
    data: spansData,
    isError: isSpansError,
    isPending: isSpansPending,
    isLoading: isSpansLoading,
    refetch: refetchSpan,
  } = useSpansList(
    {
      ...params,
      type: undefined,
    },
    {
      ...config,
      enabled: !isTracesData && isEnabled,
      placeholderData: keepPreviousData,
    } as never,
  );

  const data = !isTracesData ? spansData : tracesData;
  const isError = !isTracesData ? isSpansError : isTracesError;
  const isPending = !isTracesData ? isSpansPending : isTracesPending;
  const isLoading = !isTracesData ? isSpansLoading : isTracesLoading;
  const refetch = !isTracesData ? refetchSpan : refetchTrace;

  return {
    refetch,
    data,
    isError,
    isPending,
    isLoading,
  } as UseTracesOrSpansListResponse;
}
