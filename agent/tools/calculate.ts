import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Perform basic math calculations (add, subtract, multiply, divide).",
  inputSchema: z.object({
    operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("The math operation"),
    a: z.number().describe("First operand"),
    b: z.number().describe("Second operand"),
  }),
  async execute({ operation, a, b }) {
    switch (operation) {
      case "add": return { result: a + b, expression: `${a} + ${b} = ${a + b}` };
      case "subtract": return { result: a - b, expression: `${a} - ${b} = ${a - b}` };
      case "multiply": return { result: a * b, expression: `${a} × ${b} = ${a * b}` };
      case "divide":
        if (b === 0) return { error: "Division by zero" };
        return { result: a / b, expression: `${a} ÷ ${b} = ${a / b}` };
    }
  },
});
