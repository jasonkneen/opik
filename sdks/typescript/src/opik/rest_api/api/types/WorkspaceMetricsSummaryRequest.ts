/**
 * This file was auto-generated by Fern from our API Definition.
 */

export interface WorkspaceMetricsSummaryRequest {
    projectIds?: string[];
    intervalStart: Date;
    intervalEnd: Date;
    startBeforeEnd?: boolean;
}
