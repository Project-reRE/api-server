import { Injectable } from '@nestjs/common'
import { CE_VERSION_PLATFORM, VersionEntity } from '../../entity/version.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FindVersionDto } from './dto/find-version.dto'

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(VersionEntity)
    private readonly versionEntity: Repository<VersionEntity>,
  ) {}

  getVersion(query: FindVersionDto) {
    return this.versionEntity.findOne({
      where: {
        platform: query.platform,
      },
    })
  }
}
