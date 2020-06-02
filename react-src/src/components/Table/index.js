import React from 'react';
import styled from 'styled-components';

const DIMENSION_UNIT = 25;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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
  height: ${DIMENSION_UNIT * 4}px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const VerticalHeaderCel = styled(Cell)`
  width: ${DIMENSION_UNIT * 4}px;
  height: ${DIMENSION_UNIT}px;
  text-align: right;
`;

const CornerHeaderCel = styled.div`
  width: ${DIMENSION_UNIT * 4}px;;
  height: ${DIMENSION_UNIT * 4}px;;
`;

const Box = styled.div`
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

const Table = ({data}) => {

  const testNames = [];
  const testRuns = [];

  data.forEach(record => {
    Object.entries(record.record).forEach(([name, value]) => {
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

  data.forEach(record => {
    const idIndex = testRuns.findIndex(t => t === record._id);

    testNames.forEach((testName, nameIndex) => {
      const recordForTestName = Object.entries(record.record).find(([name, value]) => {
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

  console.log('matrix',  matrix)
  console.log('testNames', testNames);
  console.log('testRuns', testRuns);
  
  return (
    <Wrapper>
      {
        matrix.map((row, i) => (
          <Row key={i}>
            {row.map((cell, j) => {
              if (!cell) {
                return <CornerHeaderCel key={j} />
              }
              if (i === 0) {
                return <HorizontalHeaderCel key={j}>{cell}</HorizontalHeaderCel>
              }
              if (j === 0) {
                return <VerticalHeaderCel key={j}>{cell}</VerticalHeaderCel>
              }
              return <Cell key={j}><Box value={cell} /></Cell>
            })}
          </Row>
        ))
      }
    </Wrapper>
  )
}

export default Table;
