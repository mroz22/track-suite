import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Divider, Header, Grid, Popup } from 'semantic-ui-react'

const DIMENSION_UNIT = 25;
const DIMENSION_RATIO_HORIZONTAL = 3;
const DIMENSION_RATIO_VERTICAL = 8;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

const Cell = styled.div`
  display: flex;
  flex-direction: column;
  width: ${DIMENSION_UNIT}px;
  height: ${DIMENSION_UNIT}px;
  padding: 4px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const HorizontalHeaderCel = styled(Cell)`
  writing-mode:vertical-rl;
  width: ${DIMENSION_UNIT}px;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;
  height: ${DIMENSION_UNIT}px;
  text-align: right;
  text-overflow: ellipsis;
`;

const CornerHeaderCel = styled.div`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO_VERTICAL}px;;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO_HORIZONTAL}px;;
`;

const Box = styled.a`
  margin: auto;
  width: 80%;
  height: 80%;
  border-radius: 15%;
  background-color: ${(props) => {
    if (props.value === 'success') return 'green';
    if (props.value === 'retried') return 'orange';
    if (props.value === 'failed') return 'red';
    return 'gray';
  }};

  &:hover {
    width: 96%;
    height: 96%;
  }
`;

const Table = ({data}) => {

  if (!data || data.length === 0) return null;

  const testNames = [];
  const testRuns = [];
  const branches = [];
  const stages = [];

  const [branch, setBranch] = useState('');
  const [stage, setStage] = useState('');

  data.forEach(record => {
    if (!branches.includes(record.branch)) {
      branches.push(record.branch);
    }
    if (record.stage) {
      record.stage.forEach(stage => {
        if (!stages.includes(stage)) {
          stages.push(stage);
        }
      })
    }
  })

  const filteredData = data.filter(record => {
      if (stage && record.stage) {
        return record.stage.includes(stage);
      }
      return true;
    })
    .filter(record => {
      if (branch && record.branch) {
        return record.branch === branch;
      }
      return true;
    })

  filteredData.forEach(record => {
    Object.entries(record.records).forEach(([name, value]) => {
      if (!testNames.includes(name)) {
        testNames.push(name);
      }
      if (!testRuns.includes(record.jobId)) {
        testRuns.push(record.jobId);
      }
    });
  })
    
  const matrix = [
    [undefined, ...testRuns],
    ...testNames.map((name) => {
      return [ name ]
      
    }),
    [undefined, ...testRuns.map((jobId) => {
      return data.find(r => r.jobId === jobId).commitMessage 
    })]
  ];

  filteredData
  .forEach(record => {
    const idIndex = testRuns.findIndex(t => t === record.jobId);

    testNames.forEach((testName, nameIndex) => {
      const recordForTestName = Object.entries(record.records).find(([name, value]) => {
        return name === testName;
      });
      if (recordForTestName) {
        matrix[nameIndex + 1][idIndex + 1] = recordForTestName[1];        
      } 
      else { 
        matrix[nameIndex + 1][idIndex + 1] = '?';        
      }
    });
  });

  const getJobUrlById = (id) => {
    const record = data.find(r => r.jobId === id);
    if (record && record.jobUrl) {
      return record.jobUrl;
    }
  }

  return (
    <React.Fragment>
       <Grid columns="4">
        <Grid.Column stretched>
          <Select onChange={(e, { value }) => setBranch(value)} placeholder='Select branch' options={branches.map(b => ({key: b, value: b, text: b}))} />
        </Grid.Column>
        <Grid.Column stretched>
          <Select onChange={(e, { value }) => setStage(value)} placeholder='Select stage' options={stages.map(b => ({key: b, value: b, text: b}))} />
        </Grid.Column>
        <Grid.Column />
      </Grid>

      <Divider horizontal>
        <Header as='h4'>
          Tracks
        </Header>
      </Divider>

      <Wrapper>
      {
        matrix.map((rows, i) => (

          <Row key={i}>
            {rows.map((cell, j) => {
              if (i === 0 && j === 0) {
                return <CornerHeaderCel key={j} />
              }
              if (i === 0) {
                return (
                  
                  <HorizontalHeaderCel key={j}>
                  <Popup
                    content={data.find(r => r.jobId === cell).commitMessage}
                    trigger={
                      <a target="_blank" href={getJobUrlById(cell)}>{cell}</a>
                  }>
                  </Popup>
                  </HorizontalHeaderCel>
                )
              }
              if (j === 0) {
                return <VerticalHeaderCel key={j}>{cell}</VerticalHeaderCel>
              }
    
              return (
                <Cell key={j}>
                  <Box 
                    value={cell}
                    target="_blank"
                    href={`${getJobUrlById(matrix[0][j])}/artifacts/file/packages/integration-tests/projects/suite-web/videos/${matrix[i][0]}.test.ts.mp4`} 
                    />
                </Cell>
              )
            })}
          </Row>
        ))
      }
      </Wrapper>
    </React.Fragment>
  )
}

export default Table;
