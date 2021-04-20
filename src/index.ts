import * as core from "@actions/core";
import * as github from "@actions/github";
import fetch, { Headers, Response } from "node-fetch";
import { URLSearchParams } from "url";

try {
  const base_url = `https://persistent.aaim.io/api/values/get`;
  const url_params = new URLSearchParams({ key: core.getInput("key") });

  fetch(`${base_url}?${url_params.toString()}`, {
    method: "GET",
    headers: new Headers({
      "x-api-key": core.getInput("access_token"),
      "x-github-repo": `${github.context.repo.owner}/${github.context.repo.repo}`,
    }),
  })
    .then((response: Response) => response.json())
    .then(
      (json: {
        status: "ok" | "error";
        data?: string | number | boolean;
        message?: string;
      }) => {
        if (json.status === "ok") {
          core.setOutput("value", json.data);
        } else {
          core.setFailed(json.message ?? "Unknown error");
        }
      }
    )
    .catch((error) => {
      core.setFailed(error);
    });
} catch (error) {
  core.setFailed(error.message);
}
