import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Convert text between formats: base64 encode/decode, URL encode/decode, JSON stringify/parse.",
  inputSchema: z.object({
    operation: z.enum(["base64_encode", "base64_decode", "url_encode", "url_decode", "json_stringify", "json_parse"]),
    input: z.string().describe("Input text to convert"),
  }),
  async execute({ operation, input }) {
    try {
      switch (operation) {
        case "base64_encode": return { result: Buffer.from(input).toString("base64") };
        case "base64_decode": return { result: Buffer.from(input, "base64").toString("utf-8") };
        case "url_encode": return { result: encodeURIComponent(input) };
        case "url_decode": return { result: decodeURIComponent(input) };
        case "json_stringify": return { result: JSON.stringify(JSON.parse(input), null, 2) };
        case "json_parse": return { result: JSON.parse(input) };
      }
    } catch (e: any) {
      return { error: e.message };
    }
  },
});
