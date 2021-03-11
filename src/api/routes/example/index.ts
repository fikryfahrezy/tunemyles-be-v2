import type {
    FastifyRequest,
    FastifyInstance,
    FastifyPluginOptions,
    HookHandlerDoneFunction,
} from "fastify";
import type { SyncHookFn } from "../../types/fasitify";
import type { PostRequestBody } from "../../types/schema";
import {
    getExample,
    postExample,
    getIdExample,
    postFileExample,
} from "./controllers";
import schemas from "./schemas";
import { controllerWrapper } from "../../utils/controller-wrapper";
import { schemaValidationError } from "../../utils/error-handler";

declare module "fastify" {
    interface FastifyInstance {
        exampleProtect: SyncHookFn;
    }
}

const { requestBody, requestHeader, requestParams, responses } = schemas;

async function routes(
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
    done: HookHandlerDoneFunction
): Promise<void> {
    fastify.get(
        "/example",
        {
            schema: {
                response: {
                    "200": responses.datas,
                    "4xx": { $ref: "#ApiResponse" },
                    "5xx": { $ref: "#ApiResponse" },
                },
            },
        },
        controllerWrapper(getExample)
    );

    fastify.post(
        "/example",
        {
            attachValidation: true,
            schema: {
                body: requestBody.postBody,
                response: {
                    "200": { $ref: "#ApiResponse" },
                    "4xx": { $ref: "#ApiResponse" },
                    "5xx": { $ref: "#ApiResponse" },
                },
            },
            preHandler: (
                req: FastifyRequest<{ Body: PostRequestBody }>,
                res,
                done
            ) => {
                const validation = req.validationError;
                if (validation) schemaValidationError(validation, res);
                done();
            },
        },
        controllerWrapper(postExample)
    );

    fastify.get(
        "/example/:id",
        {
            schema: {
                params: requestParams.routeId,
                response: {
                    "200": responses.data,
                    "4xx": { $ref: "#ApiResponse" },
                    "5xx": { $ref: "#ApiResponse" },
                },
            },
        },
        controllerWrapper(getIdExample)
    );

    fastify.post(
        "/example/file",
        {
            schema: {
                body: requestBody.postFile,
                response: {
                    "200": { $ref: "#ApiResponse" },
                    "4xx": { $ref: "#ApiResponse" },
                    "5xx": { $ref: "#ApiResponse" },
                },
            },
        },
        controllerWrapper(postFileExample)
    );

    fastify.get(
        "/example/private",
        {
            attachValidation: true,
            schema: {
                headers: requestHeader.private,
                response: {
                    "200": responses.datas,
                    "4xx": { $ref: "#ApiResponse" },
                    "5xx": { $ref: "#ApiResponse" },
                },
            },
            preHandler: fastify.auth(
                [
                    (req, res, done) => {
                        const validation = req.validationError;
                        if (validation) schemaValidationError(validation, res);
                        done();
                    },
                    fastify.exampleProtect,
                ],
                { run: "all" }
            ),
        },
        controllerWrapper(getExample)
    );

    done();
}

export default routes;