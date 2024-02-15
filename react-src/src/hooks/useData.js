import { useEffect, useState, useMemo } from "react";
import axios from "axios";

import { useBranch } from "./useBranch";

const server = process.env.REACT_APP_API_URL || "";

export const useData = ({ branches }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [rawData, setRawData] = useState([]);

  const branch = useBranch();

  const fetchData = (b) => {
    setLoadingData(true);
    return axios
      .get(encodeURI(`${server}/api/test-records/?branch=${b || "develop"}`))
      .then((response) => {
        setRawData(response.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  useEffect(() => {
    fetchData(branch);
  }, [branch]);

  const { data, stats } = useMemo(() => {
    if (!rawData.length) return { data: {}, stats: {} };
    const stats = {};
    rawData.forEach((record) => {
      if (!record.records) return;
      Object.entries(record.records).forEach(([test, value]) => {
        if (!stats[test]) {
          stats[test] = {
            success: 0,
            total: 0,
          };
        }
        stats[test].total += 1;
        if (value === "success") {
          stats[test].success += 1;
        }
      });
    });
    const testNames = [];
    const testRuns = [];

    const getAllStages = () => {
      const stages = [];
      rawData.forEach((record) => {
        if (!stages.includes(record.stage.join())) {
          stages.push(record.stage.join());
        }
      });
      return stages;
    };
    const stages = getAllStages();

    const allTestNamesPerStage = rawData.reduce((accumulator, record) => {
      const stage = record.stage.join();
      if (!accumulator[stage]) {
        accumulator[stage] = [];
      }
      accumulator[stage] = Array.from(
        new Set([...accumulator[stage], ...Object.keys(record.records)])
      );
      return accumulator;
    }, {});

    const filteredData = rawData.filter((record) => {
      if (branch && record.branch) {
        return record.branch === branch;
      }
      return true;
    });

    filteredData.forEach((record) => {
      Object.entries(record.records).forEach(([name, value]) => {
        if (!testNames.includes(name)) {
          testNames.push(name);
        }
        if (!testRuns.includes(record.jobId)) {
          testRuns.push(record.jobId);
        }
      });
    });

    let output = filteredData.reduce((accumulator, record) => {
      if (!record.commitSha) return accumulator;

      if (!accumulator[record.commitSha]) {
        accumulator[record.commitSha] = {
          stages: {},
          branch: record.branch,
          commitMessage: record.commitMessage,
        };
      }

      const stage = record.stage.join();
      // ensure each stage has all tests
      if (
        Object.keys(record.records).length < allTestNamesPerStage[stage].length
      ) {
        Object.assign(
          record.records,
          allTestNamesPerStage[stage].reduce(
            (o, key) => ({
              [key]: "missing",
              ...o,
            }),
            { ...record.records }
          )
        );
      }

      accumulator[record.commitSha].stages[stage] = record;

      return accumulator;
    }, {});

    Object.keys(output).forEach((commitSha) => {
      if (Object.keys(output[commitSha].stages).length < stages.length) {
        const missingStages = stages.filter(
          (s) => !Object.keys(output[commitSha].stages).includes(s)
        );

        const filledStages = missingStages.reduce((accumulator, s) => {
          accumulator[s] = {};
          accumulator[s].records = allTestNamesPerStage[s].reduce(
            (o, key) => ({
              ...o,
              [key]: "missing",
            }),
            {}
          );
          return accumulator;
        }, {});

        Object.assign(output[commitSha].stages, filledStages);
      }
    });

    return { data: output, stats };
  }, [rawData]);

  return {
    loadingData,
    data,
    stats,
    branch,
    branches,
  };
};
