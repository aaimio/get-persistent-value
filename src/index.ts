import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosResponse } from "axios";
import { URLSearchParams } from "url";

interface ApiResponse {
  status: "ok" | "error";
  data?: string | number | boolean;
  message?: string;
}

const handleApiResponse = (json: AxiosResponse<ApiResponse>) => {
  if (json.data.status === "ok") {
    core.setOutput("value", json.data.data);
  } else {
    core.setFailed(json.data.message ?? "Unknown error");
  }
};

try {
  const base_url = `https://persistent.aaim.io/api/values/get`;
  const url_params = new URLSearchParams({ key: core.getInput("key") });

  axios
    .get(`${base_url}?${url_params.toString()}`, {
      headers: {
        "x-api-key": core.getInput("access_token"),
        "x-github-repo": `${github.context.repo.owner}/${github.context.repo.repo}`,
      },
    })
    .then(handleApiResponse)
    .catch((error) => core.setFailed(error));
} catch (error) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  core.setFailed(error as any);
}
