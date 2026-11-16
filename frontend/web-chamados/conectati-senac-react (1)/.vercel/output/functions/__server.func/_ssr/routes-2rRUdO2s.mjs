import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-2rRUdO2s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function Index() {
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		nav({
			to: "/home",
			replace: true
		});
	}, [nav]);
	return null;
}
export { Index as component };
