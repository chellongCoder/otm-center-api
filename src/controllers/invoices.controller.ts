import { MobileContext } from '@/auth/authorizationChecker';
import { CreateInvoiceDto } from '@/dtos/create-invoice.dto';
import { successResponse } from '@/helpers/response.helper';
import { Invoices } from '@/models/invoices.model';
import { PermissionKeys } from '@/models/permissions.model';
import { InvoicesService } from '@/services/invoices.service';
import { Authorized, Body, Controller, Delete, Get, Param, Post, Put, QueryParam, Req, Res } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';

@Service()
@Controller('/invoices')
export class InvoicesController {
  constructor(public service: InvoicesService) {}

  @Get('/')
  @OpenAPI({ summary: 'Get invoices list' })
  async findAll(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('order') order: string,
    @QueryParam('search') search: string,
    @Res() res: any,
  ) {
    const data = await this.service.findAll(page, limit, order, search);
    return successResponse({ res, data, status_code: 200 });
  }

  // @Get('/:id')
  // @OpenAPI({ summary: 'Get invoices by id' })
  // async findById(@Param('id') id: number, @Res() res: any) {
  //   const data = await this.service.findById(id);
  //   return successResponse({ res, data, status_code: 200 });
  // }

  @Get('/list')
  @Authorized([PermissionKeys.STUDENT])
  @OpenAPI({ summary: 'Get invoices' })
  async getListInvoices(@Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.getListInvoices(user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 200 });
  }

  @Post('/')
  @Authorized([PermissionKeys.STAFF])
  @OpenAPI({ summary: 'Create invoices' })
  async create(@Body({ required: true }) body: CreateInvoiceDto, @Res() res: any, @Req() req: any) {
    const { user_workspace_context, workspace_context }: MobileContext = req.mobile_context;
    const data = await this.service.create(body, user_workspace_context.id, workspace_context.id);
    return successResponse({ res, data, status_code: 201 });
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update invoices' })
  async update() {
    try {
    } catch (error) {
      return { error };
    }
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete invoices' })
  async delete(@Param('id') id: number, @Res() res: any) {
    const data = await this.service.delete(id);
    return successResponse({ res, data, status_code: 200 });
  }
}
