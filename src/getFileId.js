export let getFileId = async (supabase, path) => {
  let enter1 = "JS-VBNET-1";
  let enter2 = "JS-VBNET-2";
  console.log(path);
  try {
    const ret2 = await supabase.rpc("path1", {
      enter: enter2,
      request: path,
    });
    console.log(ret2);
    if (ret2.data.length === 0) {
        const ret1 = await supabase.rpc("path1", {
        enter: enter1,
        request: path,
      });
      ret1.enter = enter1;
      return ret1;
    } else {
      ret2.enter = enter2;
      return ret2;
    }
  } catch (error) {
    console.error("supabase.rpc error:", error);
    return error;
  }
};
