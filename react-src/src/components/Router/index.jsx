import React, { useEffect, useState } from "react";
import {
  HashRouter,
  Switch,
  Route,
  useHistory,
  withRouter,
  useLocation,
  matchPath,
  Link,
} from "react-router-dom";
import axios from "axios";
import { Select, Divider, Header, Grid, Container } from "semantic-ui-react";

import Table from "../Table";
import Detail from "../Detail";
import legs from "../../fried-frog-legs.jpg";

const Menu = withRouter(({ branches, onSelectBranch }) => {
  const history = useHistory();
  const location = useLocation();

  const [branch, setBranch] = useState("");

  useEffect(() => {
    const path = matchPath(location.pathname, {
      path: "/:branch",
    });

    if (path) {
      onSelectBranch(path.params.branch.trim());
      setBranch(path.params.branch.trim());
    } else {
      onSelectBranch("");
      setBranch("");
    }
  }, [location]);

  return (
    <div>
      <Select
        value={branch}
        onChange={(e, { value }) => {
          onSelectBranch(value);
          console.log(history);
          history.push("/" + value);
        }}
        placeholder="Select branch"
        options={branches.map((b) => ({
          key: b,
          value: b,
          text: b,
        }))}
      />
    </div>
  );
});

export default () => {
  const server = process.env.REACT_APP_API_URL || "";

  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [sortedData, setSortedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState("develop");


  const getAllStages = () => {
    const stages = [];
    data.forEach((record) => {
      if (!stages.includes(record.stage.join())) {
        stages.push(record.stage.join());
      }
    });
    return stages;
  };

  const fetchBranches = () => {
    setLoading(true);
    return axios.get(`${server}/api/test-records/branches`).then((response) => {
      console.log('get branches', response);
      setBranches(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const fetchData = (b) => {
    return axios
      .get(`${server}/api/test-records/?branch=${b || 'develop'}`)
      .then((response) => {
        setData(response.data);
    
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  useEffect(() => {
    fetchData(branch);
  }, [branch])

  useEffect(() => {
    
    const testNames = [];
    const testRuns = [];
    const stages = getAllStages();
    console.log("branch", branch.length);

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

    const filteredData = data.filter((record) => {
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

    console.log("sorted data", branch, data, output);

    setSortedData(output);
  }, [data, branch]);

  return (
    <div>
      {!loading && (
        <HashRouter>
          <Container>
            <Grid columns="4">
              <Grid.Column stretched>
                <Menu
                  branches={branches}
                  onSelectBranch={(value) => setBranch(value)}
                />
              </Grid.Column>
            </Grid>
          </Container>

          <Divider horizontal>
            <Header as="h4">Tracks</Header>
          </Divider>

          <Switch>
            <Route exact path="/:branch/:commit">
              <Detail data={sortedData} />
            </Route>
            <Route path="/:branch">
              <Table data={sortedData} />
            </Route>
            <Route path="/">
              <Table data={sortedData} />
            </Route>
          </Switch>
        </HashRouter>
      )}

      {loading && "loading..."}

      {(!data || !data.length) && !loading && (
        <Container textAlign="center">
          <Header>
            No data here :( You may still enjoy these crunchy fried frog legs
          </Header>
          <img src={legs} />
        </Container>
      )}
    </div>
  );
};
