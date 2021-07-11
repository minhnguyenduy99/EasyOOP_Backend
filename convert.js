const readline = require("readline").createInterface({
  input: require("fs").createReadStream("./.production.env")
});

const azureEnvs = [];

readline.on("line", (line) => {
  if (!line || line[0] === "#") {
    return;
  }
  const [key, value] = line.split("=");
  azureEnvs.push({
    name: key,
    value,
    slotSetting: false
  })
})

readline.on("close", () => {
  require("fs").writeFileSync("./azure.env", JSON.stringify(azureEnvs));
})

