import React from "react";
import {
  HashRouter,
  Switch,
  Route,
  useHistory,
  withRouter,
} from "react-router-dom";
import { Select, Divider, Header, Grid, Container } from "semantic-ui-react";
import Table from "../Table";
// import Detail from "../Detail";
import legs from "../../fried-frog-legs.jpg";
import { useBranch } from "../../hooks/useBranch";
import { useBranches } from "../../hooks/useBranches";

const Menu = withRouter(({ branches }) => {
  const history = useHistory();

  const branch = useBranch();

  return (
    <div>
      <Select
        value={branch}
        onChange={(e, { value }) => {
          console.log("value is", value);
          history.push("/" + value.replace("/", "-"));
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
  const { branches } = useBranches();
  return (
    <div>
      <HashRouter>
        <Container>
          <Grid columns="4">
            <Grid.Column stretched>
              <Menu branches={branches} />
            </Grid.Column>
          </Grid>
        </Container>

        <Divider horizontal>
          <Header as="h4">Tracks</Header>
        </Divider>

        <Switch>
          <Route exact path="/:branch/:commit">
            {/* <Detail data={data} stats={stats} /> */}
          </Route>
          <Route path="/:branch">
            {branches.length && <Table branches={branches} />}
          </Route>
        </Switch>
      </HashRouter>
    </div>
  );
};
