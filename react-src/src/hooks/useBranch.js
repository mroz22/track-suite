import { useLocation, matchPath } from "react-router-dom";

export const useBranch = () => {
  const location = useLocation();
  const path = matchPath(location.pathname, {
    path: "/:branch",
  });

  if (path && path.params && path.params.branch) {
    return path.params.branch;
  }

  return "develop";
};
