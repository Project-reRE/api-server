import { ApiProperty } from '@nestjs/swagger'
import { CE_VERSION_PLATFORM } from 'apps/rest-api-gateway/src/entity/version.entity'
import { IsEnum } from 'class-validator'

export class FindVersionDto {
  @ApiProperty({ description: '플랫폼', enum: CE_VERSION_PLATFORM })
  @IsEnum(CE_VERSION_PLATFORM)
  platform: CE_VERSION_PLATFORM
}
