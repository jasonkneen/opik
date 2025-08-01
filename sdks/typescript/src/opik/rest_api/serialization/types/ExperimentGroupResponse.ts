/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { GroupContent } from "./GroupContent";

export const ExperimentGroupResponse: core.serialization.ObjectSchema<
    serializers.ExperimentGroupResponse.Raw,
    OpikApi.ExperimentGroupResponse
> = core.serialization.object({
    content: core.serialization.record(core.serialization.string(), GroupContent).optional(),
});

export declare namespace ExperimentGroupResponse {
    export interface Raw {
        content?: Record<string, GroupContent.Raw> | null;
    }
}
