import { CurrentUser } from '@auth/decorators/CurrentUser.decorator';
import { JwtAuthGuard } from '@auth/guards/JwtAuth.guard';
import { BaseResponseDto } from '@common/dto/BaseResponse.dto';
import { IUser } from '@common/interfaces/User.interface';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/CreateDebt.dto';
import { DashboardSummaryDto } from './dto/DashboardSummary.dto';
import { DebtQueryDto } from './dto/DebtQuery.dto';
import { DebtResponseDto } from './dto/DebtResponse.dto';
import { ExportDebtsDto } from './dto/ExportDebts.dto';
import { UpdateDebtDto } from './dto/UpdateDebt.dto';
import { ExportService } from './export.service';

@ApiTags('Debts')
@Controller('debts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DebtsController {
  constructor(
    private readonly debtsService: DebtsService,
    private readonly exportService: ExportService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new debt' })
  @ApiResponse({
    status: 201,
    description: 'Debt created successfully',
    type: BaseResponseDto<DebtResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or business rules violation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User cannot create this debt',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - Creditor or debtor not found',
  })
  async createDebt(
    @Body() createDebtDto: CreateDebtDto,
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<DebtResponseDto>> {
    const debt = await this.debtsService.createDebt(createDebtDto, user.id);
    return BaseResponseDto.success('Debt created successfully', debt);
  }

  @Get()
  @ApiOperation({ summary: 'Get all debts with filters and pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PENDING', 'PAID', 'OVERDUE', 'CANCELLED'],
  })
  @ApiQuery({ name: 'isPaid', required: false, type: Boolean })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search in description',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'amount', 'dueDate', 'priority'],
  })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Debts retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getAllDebts(@Query() query: DebtQueryDto, @CurrentUser() user: IUser) {
    const result = await this.debtsService.getAllDebts(query, user.id);
    return BaseResponseDto.success('Debts retrieved successfully', result);
  }

  @Get('dashboard/summary')
  @ApiOperation({ summary: 'Get dashboard summary with debt statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
    type: BaseResponseDto<DashboardSummaryDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getDashboardSummary(
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<DashboardSummaryDto>> {
    const summary = await this.debtsService.getDashboardSummary(user.id);
    return BaseResponseDto.success(
      'Dashboard summary retrieved successfully',
      summary
    );
  }

  @Get('export/stats')
  @ApiOperation({ summary: 'Get export statistics and available options' })
  @ApiResponse({
    status: 200,
    description: 'Export statistics retrieved successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getExportStats(@CurrentUser() user: IUser) {
    const stats = await this.exportService.getExportStats(user.id);
    return BaseResponseDto.success(
      'Export statistics retrieved successfully',
      stats
    );
  }

  @Post('export')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Export debts in specified format with filters' })
  @ApiResponse({
    status: 200,
    description: 'Debts exported successfully',
    type: BaseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid export parameters',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async exportDebts(
    @Body() exportDto: ExportDebtsDto,
    @CurrentUser() user: IUser,
    @Res() res: Response
  ) {
    const exportResult = await this.exportService.exportDebts(
      exportDto,
      user.id
    );

    // Use res.download() for proper file download
    res.download(exportResult.filePath, exportResult.filename, async err => {
      if (err) {
        // this.logger.error(`Download error: ${err.message}`); // Original code had this line commented out
      }

      // Clean up temporary file after download (success or error)
      await this.exportService.cleanupTempFile(exportResult.filePath);
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get debt by ID' })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: 200,
    description: 'Debt retrieved successfully',
    type: BaseResponseDto<DebtResponseDto>,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have access to this debt',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - Debt not found',
  })
  async getDebtById(
    @Param('id') id: string,
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<DebtResponseDto>> {
    const debt = await this.debtsService.getDebtById(id, user.id);
    return BaseResponseDto.success('Debt retrieved successfully', debt);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update debt' })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: 200,
    description: 'Debt updated successfully',
    type: BaseResponseDto<DebtResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or business rules violation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only creditor can modify debt',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - Debt not found',
  })
  async updateDebt(
    @Param('id') id: string,
    @Body() updateDebtDto: UpdateDebtDto,
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<DebtResponseDto>> {
    const debt = await this.debtsService.updateDebt(id, updateDebtDto, user.id);
    return BaseResponseDto.success('Debt updated successfully', debt);
  }

  @Put(':id/mark-as-paid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark debt as paid' })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: 200,
    description: 'Debt marked as paid successfully',
    type: BaseResponseDto<DebtResponseDto>,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Debt already paid',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only creditor can mark debt as paid',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - Debt not found',
  })
  async markAsPaid(
    @Param('id') id: string,
    @CurrentUser() user: IUser
  ): Promise<BaseResponseDto<DebtResponseDto>> {
    const debt = await this.debtsService.markAsPaid(id, user.id);
    return BaseResponseDto.success('Debt marked as paid successfully', debt);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete debt' })
  @ApiParam({ name: 'id', description: 'Debt ID' })
  @ApiResponse({
    status: 204,
    description: 'Debt deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Cannot delete paid debts',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only creditor can delete debt',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found - Debt not found',
  })
  async deleteDebt(
    @Param('id') id: string,
    @CurrentUser() user: IUser
  ): Promise<void> {
    await this.debtsService.deleteDebt(id, user.id);
  }
}
