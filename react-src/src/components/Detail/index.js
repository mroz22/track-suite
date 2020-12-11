import autoprefixer from "autoprefixer";
import React from "react";
import { useParams } from "react-router-dom";

const Detail = ({ data }) => {
  const { commit } = useParams();

  console.log(data[commit]);

  if (!data || !data[commit]) {
    return "No luck here";
  }

  const stateToColor = (state) => {
    switch (state) {
      case "passed":
        return "green";
      case "pending":
        return "blue";
      case "failed":
        return "red";
      default:
        return "pink";
    }
  };

  // todo: add link to video
  // href={`${data[pipeline].stages[stage].jobUrl}/artifacts/file/packages/integration-tests/projects/suite-web/videos/${record}.test.ts.mp4`}

  return (
    <div>
      {/* index??? */}
      {/* {Object.entries(data[commit].stages).map(([stage, data]) => {
        return (
          <div>
            <div>
              {stage}
            </div>
            {(!data.tests || !data.tests.length) && "Nothing here"}
            {data.tests &&
              data.tests.map((test) => (
                <div>
                  {test.attempts.map((attempt) => (
                    <div
                      style={{
                        color: stateToColor(attempt.state),
                      }}
                    >
                      <a href={`#${test.title.join(">>")}`}>{test.title.join(" >> ")}</a>
                    </div>
                  ))}
                </div>
              ))}
          </div>
        );
      })} */}
      {Object.entries(data[commit].stages).map(([stage, data]) => {
        return (
          <div>
            <h1>
              <a href={data.jobUrl}>{stage}</a>
            </h1>
            {(!data.tests || !data.tests.length) && "Nothing here"}
            {data.tests &&
              data.tests.map((test) => (
                <div>
                  {test.attempts.map((attempt) => (
                    <div
                      style={{
                        backgroundColor: stateToColor(attempt.state),
                      }}
                    >
                      <h3 id={test.title.join(">>")}>
                        {test.title.join(" >> ")}
                      </h3>
                      {attempt.screenshots.map((screenshot) => (
                        <div>
                          <div>{screenshot.name}</div>
                          <img
                            style={{
                              display: "block",
                              marginLeft: "auto",
                              marginRight: "auto",
                              marginTop: '8px',
                              marginBottom: '8px',
                              maxWidth: '100vw',
                              border: "4px dotted gray",
                            }}
                            src={`${data.jobUrl}${screenshot.path.replace(
                              "trezor-suite",
                              "artifacts/raw"
                            )}`}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
};

export default Detail;
