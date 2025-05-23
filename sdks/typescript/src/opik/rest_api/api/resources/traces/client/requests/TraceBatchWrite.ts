/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as OpikApi from "../../../../index";

/**
 * @example
 *     {
 *         traces: [{
 *                 startTime: "2024-01-15T09:30:00Z"
 *             }]
 *     }
 */
export interface TraceBatchWrite {
    traces: OpikApi.TraceWrite[];
}
