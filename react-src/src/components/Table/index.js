import React from "react";
import styled from "styled-components";
import { Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { useData } from "../../hooks/useData";

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
  font-size: 11px;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const HorizontalHeaderCel = styled(Cell)`
  writing-mode: vertical-rl;
  width: ${DIMENSION_UNIT}px;
  max-height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
  height: auto;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
  white-space: no-wrap;
  display: inline;
  font-size: 11px;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  height: ${DIMENSION_UNIT}px;
  min-width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  text-align: right;
  text-overflow: ellipsis;
  align-items: flex-end;
  padding-right: ${DIMENSION_UNIT}px;
  flex-direction: row;
  justify-content: end;
`;

const CornerHeaderCel = styled.div`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  max-height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
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

const Table = ({ branches }) => {
  const { data, stats, loadingData } = useData({ branches });
  const getDuration = (durationMs) => {
    if (!durationMs) return "?";
    const minutes = durationMs / (1000 * 60);
    return Math.round(minutes * 10) / 10;
  };

  if (loadingData)
    return (
      <Wrapper>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Loading...
        </div>
      </Wrapper>
    );

  return (
    <React.Fragment>
      <Wrapper>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <CornerHeaderCel />
            {Object.keys(data).map((pipeline, i) => (
              <Popup
                key={i}
                content={
                  <div>
                    <div>{pipeline}.</div>
                    <div>{data[pipeline].commitMessage}</div>
                  </div>
                }
                trigger={
                  <HorizontalHeaderCel key={i}>
                    {/* <Link to={`${data[pipeline].branch}/${pipeline}`}> */}
                    {data[pipeline].commitMessage}
                    {/* </Link> */}
                  </HorizontalHeaderCel>
                }
              />
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "row" }}>
            {Object.keys(data).map((pipeline, i) => (
              <Col key={i}>
                {Object.keys(data[pipeline].stages)
                  .sort()
                  .map((stage, j) => {
                    if (i === 0) {
                      return (
                        <div key={j}>
                          <VerticalHeaderCel style={{ fontWeight: "bold" }}>
                            {stage}
                          </VerticalHeaderCel>
                          {Object.keys(data[pipeline].stages[stage].records)
                            .sort()
                            .map((record) => (
                              <VerticalHeaderCel key={record}>
                                <div>{record} </div>
                                <div style={{ width: "32px" }}>
                                  {Math.round(
                                    100 *
                                      (stats[record].success /
                                        stats[record].total)
                                  )}
                                </div>
                              </VerticalHeaderCel>
                            ))}
                          <VerticalHeaderCel>Duration:</VerticalHeaderCel>
                        </div>
                      );
                    }
                  })}
              </Col>
            ))}

            {Object.keys(data).map((pipeline, i) => (
              <Col key={i}>
                {Object.keys(data[pipeline].stages)
                  .sort()
                  .map((stage, j) => {
                    return (
                      <div key={j}>
                        <Cell></Cell>
                        {Object.keys(data[pipeline].stages[stage].records)
                          .sort()
                          .map((record, k) => {
                            return (
                              <Popup
                                key={k}
                                content={`"${record}" test on branch "${data[pipeline].stages[stage].branch}.`}
                                trigger={
                                  <Cell>
                                    <Box
                                      value={
                                        data[pipeline].stages[stage].records[
                                          record
                                        ]
                                      }
                                      target="_blank"
                                      href={`${data[pipeline].stages[stage].jobUrl}`}
                                    />
                                  </Cell>
                                }
                              />
                            );
                          })}
                        <Cell>
                          {getDuration(data[pipeline].stages[stage].duration)}
                        </Cell>
                      </div>
                    );
                  })}
              </Col>
            ))}
          </div>
        </div>
      </Wrapper>
      {/* <div>
        https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/899939339/artifacts/raw/packages/integration-tests/projects/suite-web/snapshots/suite/connecting-devices.test.ts/__diff_data__/seedless.diff.png
        "https://gitlab.com/satoshilabs/trezor/trezor-suite/-/jobs/899928052"
        jobUrl + /artifacts/raw + path.replace('/trezor-suite', '/raw')
        {data
          .find((d) => d.screenshots && d.screenshots.length)
          .screenshots.map((s) => {
            return (
              <div>
                <div>const:</div>
                <div>path: {JSON.stringify(s, null, 2).path}</div>
              </div>
            );
          })}
      </div> */}
    </React.Fragment>
  );
};

export default Table;
