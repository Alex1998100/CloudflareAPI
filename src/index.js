import readRequestBody from "./readRequestBody";
import { createClient } from "@supabase/supabase-js";
import { handleOptions } from "./handleOptions";
import { underConstruction } from "./underConstruction";
import { getFileId } from "./getFileId";
import { anonFileDownload } from "./anonFileDownload.js";
import { error } from "console";

export default {
  async fetch(request, env, ctx) {
    //console.log(request);
    //console.log(JSON.stringify([...request.headers], null, 2));
    const URL = env.SUPABASE_URL;
    const KEY = env.SUPABASE_KEY;
    const supabase = createClient(`${URL}`, `${KEY}`);
    if (request.method === "OPTIONS") {
      return handleOptions(request);
    } else if (request.method === "POST") {
      let reqBody = [];
      reqBody = await readRequestBody(request);
      console.log("POST", request.url, reqBody);
      let body = JSON.parse(reqBody);
      //{"fileid":"/2000/Index.htm"}
      if (body.fileid && body.fileid.toString().startsWith("/")) {
        let supabaseReturn = await getFileId(supabase, body.fileid);
        if (supabaseReturn.error) {
          console.log("found error");
          return new Response(JSON.stringify(supabaseReturn, null, 2), {
            headers: {
              "content-type": "application/json",
            },
          });
        } else if (supabaseReturn.data.length === 0) {
          console.log("no data");
          return new Response(JSON.stringify(supabaseReturn, null, 2), {
            headers: {
              "content-type": "application/json",
            },
          });
        } else {
          return new Response(JSON.stringify(supabaseReturn.data[0], null, 2), {
            headers: {
              "content-type": "application/json",
            },
          });
        }
      }
      // {"get":"1k1FgoAeMyocD6btJ8_JbEhfjDv2dexH7"} - htm
      //"1V7lvtITKVvMEFSsm9R_yjSR0jk4zRDU3" - image
      else if (body.get && body.get.length === 33) {
        let googleReturn = await anonFileDownload(env.apiKey2, body.get);
        console.log(googleReturn);
        if (googleReturn.error || googleReturn.errors) {
          return new Response(googleReturn, {
            headers: {
              "content-type": "application/json",
            },
          });
        } else if (googleReturn[0] ===200) {
          if (googleReturn[2].toString().startsWith("text/")) {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          } else if (googleReturn[2].toString().startsWith("application/")) {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          } else if (googleReturn[2].toString().startsWith("image/")) {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          } else if (googleReturn[2].toString().startsWith("video/")) {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          } else {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          }
        }
      } else if (body.show && body.show.toString().startsWith("/")) {
        let supabaseReturn = await getFileId(supabase, body.show);
        if (!supabaseReturn.error && supabaseReturn.data.length > 0 && supabaseReturn.data[0].retid.toString().length === 33) {
          console.log(supabaseReturn.data[0].retid);
          let googleReturn = await anonFileDownload(env.apiKey2, supabaseReturn.data[0].retid);
          console.log(googleReturn);
          if (!googleReturn.error || !googleReturn.errors && googleReturn[0] ===200) {
            return new Response(googleReturn[4], {
              headers: {
                "content-type": googleReturn[2],
                "content-length": googleReturn[2].length,
              },
            });
          } else
            return new Response(JSON.stringify(googleReturn, null, 2), {
              headers: {
                "content-type": "application/json",
              },
            });
        } else
          return new Response(JSON.stringify(supabaseReturn, null, 2), {
            headers: {
              "content-type": "application/json",
            },
          });
      } else
        return new Response(`{"fileid":"/2000/Index.htm"} or {"get":"1k1FgoAeMyocD6btJ8_JbEhfjDv2dexH7"} or {"show":"/2000/Index.htm"}`, {
          headers: {
            "content-type": "application/json",
          },
        });
    } else if (request.method === "PATCH") {
      return new Response(underConstruction, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    } else if (request.method === "GET") {
      return new Response(underConstruction, {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      });
    }
  },
};
