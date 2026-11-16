import { n as createMiddleware } from "./server-Bl9TOt0q.mjs";
import { t as renderErrorPage } from "./ssr.mjs";
import { B as isPromise } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/start-CfFkKfPU.js
function dedupeSerializationAdapters(deduped, serializationAdapters) {
	for (let i = 0, len = serializationAdapters.length; i < len; i++) {
		const current = serializationAdapters[i];
		if (!deduped.has(current)) {
			deduped.add(current);
			if (current.extends) dedupeSerializationAdapters(deduped, current.extends);
		}
	}
}
function dedupeOptions(options) {
	if (options.serializationAdapters) {
		const deduped = /* @__PURE__ */ new Set();
		dedupeSerializationAdapters(deduped, options.serializationAdapters);
		options.serializationAdapters = Array.from(deduped);
	}
	return options;
}
var createStart = (getOptions) => {
	return {
		getOptions: () => {
			const options = getOptions();
			return isPromise(options) ? Promise.resolve(options).then(dedupeOptions) : dedupeOptions(options);
		},
		createMiddleware
	};
};
var errorMiddleware = createMiddleware().server(async ({ next }) => {
	try {
		return await next();
	} catch (error) {
		if (error != null && typeof error === "object" && "statusCode" in error) throw error;
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
});
var startInstance = createStart(() => ({ requestMiddleware: [errorMiddleware] }));
export { startInstance };
