import React, { useState } from 'react';
import styled from 'styled-components';
import { Select, Button, Divider, Header, Icon } from 'semantic-ui-react'

const DIMENSION_UNIT = 25;
const DIMENSION_RATIO = 8;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`

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
  height: ${DIMENSION_UNIT * DIMENSION_RATIO}px;
  text-overflow: ellipsis;
  overflow: hidden;
  margin-bottom: 8px;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO}px;
  height: ${DIMENSION_UNIT}px;
  text-align: right;
  text-overflow: ellipsis;
`;

const CornerHeaderCel = styled.div`
  width: ${DIMENSION_UNIT * DIMENSION_RATIO}px;;
  height: ${DIMENSION_UNIT * DIMENSION_RATIO}px;;
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
`;

const Table = ({data, dropDataFn}) => {

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
      if (!testRuns.includes(record._id)) {
        testRuns.push(record._id);
      }
    });
  })
    
  const matrix = [
    [undefined, ...testRuns],
    ...testNames.map((name, i) => {
      return [
        name,
      ]
    })
  ];

  filteredData
  .forEach(record => {
    const idIndex = testRuns.findIndex(t => t === record._id);

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
    const record = data.find(r => r._id === id);
    if (record && record.jobUrl) {
      return record.jobUrl;
    }
  }

  return (
    <React.Fragment>
      <div>

      <Select onChange={(e, { value }) => setBranch(value)} placeholder='Select branch' options={branches.map(b => ({key: b, value: b, text: b}))} />
      <Select onChange={(e, { value }) => setStage(value)} placeholder='Select stage' options={stages.map(b => ({key: b, value: b, text: b}))} />
      <Button negative onClick={() => dropDataFn()}>Drop data</Button>
      </div>

      <Divider horizontal>
        <Header as='h4'>
          <Icon name='tag' />
          Tracks
        </Header>
      </Divider>

      <Wrapper>
      {
        matrix.map((row, i) => (
          <Row key={i}>
            {row.map((cell, j) => {
              if (!cell) {
                return <CornerHeaderCel key={j} />
              }
              if (i === 0) {
                return (
                  <HorizontalHeaderCel key={j}>
                    <a href={getJobUrlById(cell)}>{cell}</a>
                  </HorizontalHeaderCel>
                )
              }
              if (j === 0) {
                return <VerticalHeaderCel key={j}>{cell}</VerticalHeaderCel>
              }
              return <Cell key={j}><Box value={cell} href={`${matrix[0][i]}/artifacts/browse/packages/integration-tests/projects/suite-web/videos/${matrix[j]}`} /></Cell>
            })}
          </Row>
        ))
      }
      </Wrapper>

    </React.Fragment>
  )
}

export default Table;
