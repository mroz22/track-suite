import React, { useState } from "react";
import styled from "styled-components";
import {
  Select,
  Divider,
  Header,
  Grid,
  Popup,
  Container,
} from "semantic-ui-react";

const DIMENSION_UNIT = 25;
const DIMENSION_RATIO_HORIZONTAL = 3;
const DIMENSION_RATIO_VERTICAL = 8;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  max-width: 90vw;
  overflow-x: auto;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  min-width: ${DIMENSION_UNIT}px;
  min-height: ${DIMENSION_UNIT}px;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px dotted gray;
`;

const HorizontalHeaderCel = styled(Cell)`
  writing-mode: vertical-rl;
  width: ${DIMENSION_UNIT}px;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  height: ${DIMENSION_UNIT}px;
  min-width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  text-align: right;
  text-overflow: ellipsis;
`;

const CornerHeaderCel = styled.div`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
  min-width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
`;

const Box = styled.a`
  margin: auto;
  width: ${DIMENSION_UNIT * 0.6}px;
  height: ${DIMENSION_UNIT * 0.6}px;
  border-radius: 15%;
  background-color: ${(props) => {
    if (props.value === "success") return "green";
    if (props.value === "retried") return "orange";
    if (props.value === "failed") return "red";
    if (props.value === "skipped") return "blue";
    return "gray";
  }};
  transition: all 0.2s;

  &:hover {
    width: ${DIMENSION_UNIT * 0.84}px;
    height: ${DIMENSION_UNIT * 0.84}px;
  }
`;

const Table = ({ data }) => {
  if (!data || data.length === 0) return null;

  console.log(data);

  const [branch, setBranch] = useState("");
  const [stage, setStage] = useState("");

  const getAllBranches = () => {
    const branches = [];
    data.forEach((record) => {
      if (!branches.includes(record.branch)) {
        branches.push(record.branch);
      }
    });
    return branches;
  };

  const getAllStages = () => {
    const stages = [];
    data.forEach((record) => {
      if (!stages.includes(record.stage.join())) {
        stages.push(record.stage.join());
      }
    });
    return stages;
  };

  const testNames = [];
  const testRuns = [];
  const branches = getAllBranches();
  const stages = getAllStages();

  const allTestNamesPerStage = data.reduce((accumulator, record) => {
    const stage = record.stage.join();
    if (!accumulator[stage]) {
      accumulator[stage] = [];
    }
    accumulator[stage] = Array.from(
      new Set([...accumulator[stage], ...Object.keys(record.records)])
    );
    return accumulator;
  }, {});

  const filteredData = data
    .filter((record) => {
      if (stage && record.stage) {
        return record.stage.includes(stage);
      }
      return true;
    })
    .filter((record) => {
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

  const matrix = [
    [undefined, ...testRuns],
    ...testNames.map((name) => {
      return [name];
    }),
  ];

  filteredData.forEach((record) => {
    const idIndex = testRuns.findIndex((t) => t === record.jobId);

    testNames.forEach((testName, nameIndex) => {
      const recordForTestName = Object.entries(record.records).find(
        ([name, value]) => {
          return name === testName;
        }
      );
      if (recordForTestName) {
        matrix[nameIndex + 1][idIndex + 1] = recordForTestName[1];
      } else {
        matrix[nameIndex + 1][idIndex + 1] = "?";
      }
    });
  });

  let output = filteredData.reduce((accumulator, record) => {
    if (!record.commitSha) return accumulator;

    if (!accumulator[record.commitSha]) {
      accumulator[record.commitSha] = {};
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

    accumulator[record.commitSha][stage] = record;

    return accumulator;
  }, {});

  Object.keys(output).forEach((commitSha) => {
    if (Object.keys(output[commitSha]).length < stages.length) {
      const missingStages = stages.filter(
        (s) => !Object.keys(output[commitSha]).includes(s)
      );
      console.log("missing", missingStages);

      const filledStages = missingStages.reduce((accumulator, s) => {
        console.log("accumulator", accumulator);
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

      Object.assign(output[commitSha], filledStages);
    }
  });

  console.log(output);

  const getJobUrlById = (id) => {
    const record = data.find((r) => r.jobId === id);
    if (record && record.jobUrl) {
      return record.jobUrl;
    }
  };

  const getDuration = (durationMs) => {
    if (!durationMs) return "?";
    const minutes = durationMs / (1000 * 60);
    return Math.round(minutes * 10) / 10;
  };

  return (
    <React.Fragment>
      <Container>
        <Grid columns="4">
          <Grid.Column stretched>
            <Select
              onChange={(e, { value }) => setBranch(value)}
              placeholder="Select branch"
              options={branches.map((b) => ({ key: b, value: b, text: b }))}
            />
          </Grid.Column>
          <Grid.Column stretched>
            <Select
              onChange={(e, { value }) => setStage(value)}
              placeholder="Select stage"
              options={stages.map((b) => ({ key: b, value: b, text: b }))}
            />
          </Grid.Column>
          <Grid.Column />
        </Grid>
      </Container>

      <Divider horizontal>
        <Header as="h4">Tracks</Header>
      </Divider>

      <Wrapper>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <CornerHeaderCel />
            {Object.keys(output).map((pipeline, i) => (
              <HorizontalHeaderCel>{pipeline}</HorizontalHeaderCel>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {Object.keys(output).map((pipeline, i) => (
              <Col>
                {Object.keys(output[pipeline]).map((stage, j) => {
                  if (i === 0) {
                    return (
                      <div>
                        <VerticalHeaderCel style={{ fontWeight: "bold" }}>
                          {stage}
                        </VerticalHeaderCel>
                        {Object.keys(output[pipeline][stage].records).map(
                          (record) => (
                            <VerticalHeaderCel>{record}</VerticalHeaderCel>
                          )
                        )}
                        <VerticalHeaderCel>Duration:</VerticalHeaderCel>
                      </div>
                    );
                  }
                })}
              </Col>
            ))}

            {Object.keys(output).map((pipeline, i) => (
              <Col>
                {Object.keys(output[pipeline]).map((stage, j) => {
                  return (
                    <div>
                      <Cell></Cell>
                      {Object.keys(output[pipeline][stage].records).map(
                        (record, k) => {
                          return (
                            <Cell key={k}>
                              <Box
                                value={output[pipeline][stage].records[record]}
                                target="_blank"
                                href={`${output[pipeline][stage].jobUrl}/artifacts/file/packages/integration-tests/projects/suite-web/videos/${record}.test.ts.mp4`}
                              />
                            </Cell>
                          );
                        }
                      )}
                      <Cell>
                        {getDuration(output[pipeline][stage].duration)}
                      </Cell>
                    </div>
                  );
                })}
              </Col>
            ))}
          </div>
        </div>
      </Wrapper>
    </React.Fragment>
  );
};

export default Table;
