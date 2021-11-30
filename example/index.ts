import { createEditor } from "../src";
import "./imgs/tu.jpg";
import sample from "./md/sample";
let defaultMd = sample as string;

window.onload = function () {
  console.time("初始化时间: ");

  const art = createEditor({
    defaultMd: defaultMd,
  });
  art.mount("#art");

  console.timeEnd("初始化时间: ");
};
