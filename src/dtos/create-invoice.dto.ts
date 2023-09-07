import { PaymentMethodInvoices } from '@/models/invoices.model';
import { IsISO8601, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

export class CreateInvoiceDto {
  @IsString()
  @JSONSchema({ description: 'code', example: 'GECKO-HD-4' })
  code: string;

  @IsNumber()
  @JSONSchema({ description: 'user_workspace_id', example: 6 })
  userWorkspaceId: number;

  @IsISO8601()
  @IsOptional()
  @JSONSchema({ description: 'hạn đóng', example: '2023-10-20' })
  dueDatePayment: Date;

  @IsNumber()
  @JSONSchema({ description: 'tổng tiền', example: 51725000 })
  totalPayment: number;

  @IsNumber()
  @JSONSchema({ description: 'đã đóng', example: 100000 })
  paidMoney: number;

  @IsNumber()
  @JSONSchema({ description: ' giảm giá', example: 12931250 })
  discount: number;

  @IsNumber()
  @JSONSchema({ description: ' đóng trong hoá đơn này', example: 1000000 })
  currentPaid: number;

  @IsString()
  @IsIn([PaymentMethodInvoices.BANKING, PaymentMethodInvoices.CASH, PaymentMethodInvoices.CO_WALLET])
  @JSONSchema({ description: ' phương thức thanh toán', example: PaymentMethodInvoices.CASH })
  paymentMethod: PaymentMethodInvoices;
}
