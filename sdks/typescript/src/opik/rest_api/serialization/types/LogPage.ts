/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../index";
import * as OpikApi from "../../api/index";
import * as core from "../../core";
import { LogItem } from "./LogItem";

export const LogPage: core.serialization.ObjectSchema<serializers.LogPage.Raw, OpikApi.LogPage> =
    core.serialization.object({
        content: core.serialization.list(LogItem).optional(),
        page: core.serialization.number().optional(),
        size: core.serialization.number().optional(),
        total: core.serialization.number().optional(),
    });

export declare namespace LogPage {
    export interface Raw {
        content?: LogItem.Raw[] | null;
        page?: number | null;
        size?: number | null;
        total?: number | null;
    }
}
