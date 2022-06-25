// @ts-check
/* eslint-env node */

import fetch from "node-fetch";

/**
 *
 * @param {import('node-fetch').Response} response
 * @returns
 */
function parseCookies(response) {
  const raw = response.headers.raw()["set-cookie"];
  return raw
    .map((entry) => {
      const parts = entry.split(";");
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join("; ");
}

/**
 *
 * @param {import('@vercel/node').VercelRequest} request
 * @param {import('@vercel/node').VercelResponse} response
 * @returns
 */
export default async function (request, response) {
  const { username, password } = request.query;
  if (
    !username ||
    !password ||
    Array.isArray(username) ||
    Array.isArray(password)
  ) {
    response.status(400).end();
    return;
  }

  const iaaaParams = new URLSearchParams();

  iaaaParams.append("appid", "portal2017");
  iaaaParams.append("userName", username);
  iaaaParams.append("password", password);
  const REDIR_URL = `https://portal.pku.edu.cn/portal2017/ssoLogin.do`;
  iaaaParams.append("redirUrl", REDIR_URL);
  /** @type {any} */
  const r = await fetch(`https://iaaa.pku.edu.cn/iaaa/oauthlogin.do`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: iaaaParams.toString(),
    redirect: "manual",
  }).then((r) => r.json());
  if (!r.success) {
    response.status(403).json({
      success: false,
      errMsg: r.errors.msg,
    });
    return;
  }
  console.log("IAAA: ", r);
  /** @type {string | null} */
  let cookie = null;
  await fetch(`${REDIR_URL}?token=${r.token}`, {
    redirect: "manual",
  }).then((r) => {
    cookie = parseCookies(r);
  });
  console.log("Portal: ", cookie);
  if (cookie === null) {
    response.status(503).json({
      success: false,
      errMsg: "Set-cookie not provided from portal login",
    });
    return;
  }
  const r3 = await fetch(
    "https://portal.pku.edu.cn/portal2017/bizcenter/score/retrScores.do",
    {
      headers: {
        cookie,
      },
    }
  ).then((r) => r.text());
  try {
    const result = JSON.parse(r3);
    result.cjxx = result.cjxx.flatMap((c) => c.list);
    response.status(200).json(result);
  } catch (e) {
    if (e instanceof SyntaxError) {
      response.status(502).json({
        success: false,
        errMsg: `Portal respond with non-JSON content: ${r3}`,
      });
    }
  }
}
