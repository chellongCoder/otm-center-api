import { Controller, Get } from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";

@Service()
@Controller("/")
export class HomeController {
  @Get("/")
  @OpenAPI({ summary: "Version" })
  async version() {
    try {
      return { version: "1.0.0" };
    } catch (error) {
      return { error };
    }
  }
}
