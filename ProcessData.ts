import fs = require("fs-extra");

export default class ProcessData {
  public transformFlie(inputPath: string, outputPath: string): boolean {
    try {
      let origStr:string = fs.readFileSync(inputPath, {encoding: "UTF-8"});
      let data:object = JSON.parse(origStr);
      if (typeof data !== "object") return false;
      this.processData(data);
      let str = JSON.stringify(data, null, 4);
      fs.writeFileSync(outputPath,str);
    } catch (e) {
      console.log(e);
      return false;
    }
    return true;
  }

  private processData(data: any): void {
    let items = ["r","g","b"];
    data.forEach(record => {
      record["category"] = items[Math.floor(Math.random() * 3)];
    })  
  }
}
let processData = new ProcessData();
processData.transformFlie("./data/communes.json","./data/output.json");

