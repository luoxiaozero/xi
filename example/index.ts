import { createEditor } from "../src";
import "./imgs/tu.jpg";
import sample from "./md/sample";
let defaultMd = sample as string;

window.onload = function () {
  let time = new Date();

  const art = createEditor({
    defaultMd: defaultMd,
  });
  art.mount("#art");

  let time_end = new Date();
  console.log("初始化时间: ", time_end.getTime() - time.getTime());
};
