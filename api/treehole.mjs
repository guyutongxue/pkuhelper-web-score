// @ts-check
/* eslint-env node */

import fetch from "node-fetch";

/**
 *
 * @param {import('@vercel/node').VercelRequest} request
 * @param {import('@vercel/node').VercelResponse} response
 * @returns
 */
export default async function (request, response) {
  const { token } = request.query;
  if (!token || Array.isArray(token)) {
    response.status(400).end();
    return;
  }

  const res = await fetch(
    `https://treehole.pku.edu.cn/api/course/score`,
    {
      headers: {
        "Authorization": `bearer ${token}`
      },
    }
  ).then((r) => r.text());
  try {
    const result = JSON.parse(res);
    response.status(200).json(result.data.score);
  } catch (e) {
    if (e instanceof SyntaxError) {
      response.status(502).json({
        success: false,
        errMsg: `Treehole respond with non-JSON content: ${res}`,
      });
    } else {
      response.status(500).json({
        success: false,
        errMsg: e instanceof Error ? e.message : e
      });
    }
  }
}
