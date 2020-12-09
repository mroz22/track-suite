import autoprefixer from "autoprefixer";
import React from "react";
import { useParams } from "react-router-dom";

const Detail = ({ data }) => {
  const { commit } = useParams();

  console.log(data[commit]);

  if (!data || !data[commit]) {
    return "No luck here";
  }

  return Object.entries(data[commit].stages).map(([stage, data]) => {
    return (
      <div>
        <h3>{stage}</h3>
        {(!data.screenshots || !data.screenshots.length) && "No screenshots"}
        {data.screenshots &&
          data.screenshots.map((screenshot) => (
            <div>
              <div>{screenshot.name}</div>
              <img
                style={{
                  border: "4px dotted pink",
                }}
                src={`${data.jobUrl}${screenshot.path.replace(
                  "trezor-suite",
                  "artifacts/raw"
                )}`}
              />
            </div>
          ))}
      </div>
    );
  });
};

export default Detail;
