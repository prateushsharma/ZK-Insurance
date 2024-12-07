import * as summon from "summon-ts"
import  mpc_framework  from "mpc-framework"
import  {EmpWasmBackend}  from "emp-wasm-backend"
import getCircuitFiles from "./getCircuitFiles.js"

const { Protocol } = mpc_framework;

export default async function generateProtocol() {
    await summon.init()

    const circuitFiles = await getCircuitFiles();

    console.log("circuitFiles: ", circuitFiles);
    

    const circuit = summon.compileBoolean("circuit/main.ts", 16, circuitFiles)

    const mpcSettings = [
        {
            name: "alice",
            inputs: ["a"],
            outputs: ["main"]
        },
        {
            name: "bob",
            inputs: ["b"],
            outputs: ["main"]
        }
    ]

    return new Protocol(circuit, mpcSettings, new EmpWasmBackend())
}