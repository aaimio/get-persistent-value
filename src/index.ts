import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import axios, { AxiosError, AxiosResponse } from "axios";
import { URLSearchParams } from "url";

interface ApiResponse {
  status: "ok" | "error";
  data?: string | number | boolean;
  message?: string;
}

try {
  const base_url = "https://persistent.aaim.io/api/values/get";
  const url_params = new URLSearchParams({ key: getInput("key") });

  axios
    .get(`${base_url}?${url_params.toString()}`, {
      headers: {
        "x-api-key": getInput("access_token"),
        "x-github-repo": `${context.repo.owner}/${context.repo.repo}`,
      },
    })
    .then((json: AxiosResponse<ApiResponse>) => {
      setOutput("value", json.data.data);
    })
    .catch((error: AxiosError) => {
      if (error.response && error.response.status === 404) {
        const defaultValue = getInput("default");

        if (defaultValue !== undefined) {
          setOutput("value", defaultValue);
          return;
        }
      }

      setFailed(error);
    });
} catch (error) {
  console.error(error);
  setFailed(error as Error);
}
