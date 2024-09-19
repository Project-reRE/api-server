import { IsNumberString, IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class QueryParamsDto {
  @ApiPropertyOptional({ description: 'The page number to return (defaults to 1)' })
  @IsOptional()
  @IsNumberString()
  readonly page?: number

  @ApiPropertyOptional({ description: 'The number of returned items per page (defaults to 25)' })
  @IsOptional()
  @IsNumberString()
  readonly limit?: number

  @ApiPropertyOptional({
    description:
      'Comma-separated of fields to sort query results. Default sort order is ascending. Use the minus (-) sign before the field.',
  })
  @IsOptional()
  @IsString()
  readonly order?: string
}
