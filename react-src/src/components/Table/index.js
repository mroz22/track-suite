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
const DIMENSION_RATIO_HORIZONTAL = 12;
const DIMENSION_RATIO_VERTICAL = 12;

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

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const HorizontalHeaderCel = styled(Cell)`
  writing-mode: vertical-rl;
  width: ${DIMENSION_UNIT}px;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
  align-items: flex-end;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  height: ${DIMENSION_UNIT}px;
  min-width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  text-align: right;
  text-overflow: ellipsis;
  align-items: flex-end;
  padding-right: ${DIMENSION_UNIT}px;
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

  console.log("incoming data", data);

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

  // filteredData.forEach((record) => {
  //   const idIndex = testRuns.findIndex((t) => t === record.jobId);

  //   testNames.forEach((testName, nameIndex) => {
  //     const recordForTestName = Object.entries(record.records).find(
  //       ([name, value]) => {
  //         return name === testName;
  //       }
  //     );
  //     if (recordForTestName) {
  //       matrix[nameIndex + 1][idIndex + 1] = recordForTestName[1];
  //     } else {
  //       matrix[nameIndex + 1][idIndex + 1] = "?";
  //     }
  //   });
  // });

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

  console.log("sorted data", output);

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
              <Popup
                content={`commitHash: ${pipeline}. commitMessage: ${output[pipeline].commitMessage}`}
                trigger={
                  <HorizontalHeaderCel key={i}>
                    {output[pipeline].branch.substr(0, 8)}/
                    {output[pipeline].commitMessage.substr(0, 8)}{" "}
                  </HorizontalHeaderCel>
                }
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {Object.keys(output).map((pipeline, i) => (
              <Col key={i}>
                {Object.keys(output[pipeline].stages)
                  .sort()
                  .map((stage, j) => {
                    if (i === 0) {
                      return (
                        <div key={j}>
                          <VerticalHeaderCel style={{ fontWeight: "bold" }}>
                            {stage}
                          </VerticalHeaderCel>
                          {Object.keys(
                            output[pipeline].stages[stage].records
                          ).map((record) => (
                            <VerticalHeaderCel key={record}>
                              {record}
                            </VerticalHeaderCel>
                          ))}
                          <VerticalHeaderCel>Duration:</VerticalHeaderCel>
                        </div>
                      );
                    }
                  })}
              </Col>
            ))}

            {Object.keys(output).map((pipeline, i) => (
              <Col key={i}>
                {Object.keys(output[pipeline].stages)
                  .sort()
                  .map((stage, j) => {
                    return (
                      <div key={j}>
                        <Cell></Cell>
                        {Object.keys(
                          output[pipeline].stages[stage].records
                        ).map((record, k) => {
                          return (
                            <Popup
                              key={k}
                              content={`"${record}" test on branch "${output[pipeline].stages[stage].branch}. runner: ${output[pipeline].stages[stage].runnerDescription}"`}
                              trigger={
                                <Cell>
                                  <Box
                                    value={
                                      output[pipeline].stages[stage].records[
                                        record
                                      ]
                                    }
                                    target="_blank"
                                    href={`${output[pipeline].stages[stage].jobUrl}/artifacts/file/packages/integration-tests/projects/suite-web/videos/${record}.test.ts.mp4`}
                                  />
                                </Cell>
                              }
                            />
                          );
                        })}
                        <Cell>
                          {getDuration(output[pipeline].stages[stage].duration)}
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
