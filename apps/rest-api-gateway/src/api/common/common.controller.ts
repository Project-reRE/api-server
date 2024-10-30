import { Controller, Get, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CE_VERSION_PLATFORM, VersionEntity } from '../../entity/version.entity'
import { plainToInstance } from 'class-transformer'
import { CommonService } from './common.service'
import { FindVersionDto } from './dto/find-version.dto'

@Controller('/common')
@ApiTags('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Get('/version')
  @ApiOperation({ summary: '버전 정보' })
  @ApiOkResponse({ type: VersionEntity })
  async getVersion(@Query() query: FindVersionDto): Promise<VersionEntity> {
    return plainToInstance(VersionEntity, await this.commonService.getVersion(query), {
      excludeExtraneousValues: true,
    })
  }
}
