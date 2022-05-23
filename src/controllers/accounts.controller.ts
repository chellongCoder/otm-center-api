import { ActiveAccountDto } from "@/dtos/activeAccount.dto";
import { NewAccountDto } from "@/dtos/newAccount.dto";
import { AccountsService } from "@/services/accounts.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  QueryParam,
} from "routing-controllers";
import { OpenAPI } from "routing-controllers-openapi";
import { Service } from "typedi";
import { FindOptionsOrderValue } from "typeorm";

@Service()
@Controller("/accounts")
export class AccountsController {
  constructor(public service: AccountsService) {}

  @Get("/")
  @OpenAPI({ summary: "Get accounts list" })
  async findAll(
    @QueryParam("page") page: number,
    @QueryParam("limit") limit: number,
    @QueryParam("orderBy") orderBy: FindOptionsOrderValue,
    @QueryParam("search") search: string
  ) {
    try {
      return this.service.findAll(page, limit, orderBy, search);
    } catch (error) {
      return { error };
    }
  }

  @Get("/:id")
  @OpenAPI({ summary: "Get account by id" })
  async findById(@Param("id") id: number) {
    try {
      return this.service.findById(id);
    } catch (error) {
      return { error };
    }
  }

  @Post("/")
  @OpenAPI({ summary: "Create account" })
  async create(@Body({ required: true }) body: NewAccountDto) {
    try {
      return this.service.create(body);
    } catch (error) {
      return { error };
    }
  }

  @Post("/:id/active")
  @OpenAPI({ summary: "Active account" })
  async active(@Param("id") id: number, @Body({ required: true }) body: ActiveAccountDto) {
    try {
      return this.service.active(id, body);
    } catch (error) {
      return { error };
    }
  }

  @Put("/:id")
  @OpenAPI({ summary: "Update account" })
  async update() {
    try {
      //TODO
    } catch (error) {
      return { error };
    }
  }

  @Delete("/:id")
  @OpenAPI({ summary: "Delete account" })
  async delete(@Param("id") id: number) {
    try {
      return this.service.delete(id);
    } catch (error) {
      return { error };
    }
  }
}
