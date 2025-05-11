import "server-only";

import { cache } from "react";
import { createCallerFactory } from ".";
import { makeQueryClient } from "./client";
import { createTRPCContext } from "./context";
import { appRouter } from "./root";

export const getQueryClient = cache(makeQueryClient);

const createCaller = createCallerFactory(appRouter);
export const caller = createCaller(createTRPCContext);
