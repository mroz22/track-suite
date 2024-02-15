import { useEffect, useState } from "react";
import axios from "axios";

import { useBranch } from "./useBranch";

const server = process.env.REACT_APP_API_URL || "";

export const useBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(false);
  const fetchBranches = () => {
    setLoadingBranches(true);
    return axios
      .get(`${server}/api/test-records/branches`)
      .then((response) => {
        setBranches(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingBranches(false);
      });
  };
  useEffect(() => {
    fetchBranches();
  }, []);

  return {
    branches,
    loadingBranches,
  };
};
