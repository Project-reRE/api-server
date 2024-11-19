import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { InjectRepository } from '@nestjs/typeorm'
import { RevaluationEntity } from '../../entity/revaluation.entity'
import { Between, MoreThan, Repository } from 'typeorm'
import { MovieEntity } from '../../entity/movie.entity'
import { count } from 'console'
import { RankingEntity } from '../../entity/ranking.entity'
import { RankingItemEntity } from '../../entity/rankingItem.entity'

const RANKING_INCLUDE_GENRE = ['액션', 'SF', '멜로/로맨스', '스릴러', '코메디']
type Genre = (typeof RANKING_INCLUDE_GENRE)[number]

@Injectable()
export class SchedulerService {
  constructor(
    @InjectRepository(RevaluationEntity)
    private readonly revaluationRepository: Repository<RevaluationEntity>,
    @InjectRepository(RankingEntity)
    private readonly rakingRepository: Repository<RankingEntity>,
    @InjectRepository(RankingItemEntity)
    private readonly rakingItemRepository: Repository<RankingItemEntity>,
  ) {}

  @Cron('0 9 * * *')
  async handleCron() {
    const ranking: Record<'액션' | 'SF' | '멜로/로맨스' | '스릴러' | '코메디', (MovieEntity & { count: number })[]> = {
      액션: [],
      SF: [],
      '멜로/로맨스': [],
      스릴러: [],
      코메디: [],
    }

    console.log('worker test', new Date(), '0--------------------')

    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0') // 월은 0부터 시작하므로 +1 필요
    const day = String(today.getDate()).padStart(2, '0')

    const movies: (MovieEntity & { count: number })[] = await this.revaluationRepository
      .createQueryBuilder('revaluation')
      .innerJoinAndSelect('revaluation.movie', 'movie')
      .select('movie.*')
      .addSelect('COUNT(*) as count')
      .where({
        createdAt: Between(`${year}-${month}-${Number(day) - 1}`, `${year}-${month}-${day}`),
      })
      .groupBy('movie.id')
      .getRawMany()

    movies.forEach((movie) => {
      movie.data.genre.map((genre) => {
        if (RANKING_INCLUDE_GENRE.includes(genre)) {
          if (ranking[genre]) ranking[genre].push({ ...movie, count: Number(movie.count) })
          else ranking[genre] = [{ ...movie, count: Number(movie.count) }]
        }
      })
    })

    Object.keys(ranking).forEach((key) => {
      if (ranking[key as Genre] === undefined) {
        ranking[key as Genre] = []
      } else {
        ranking[key].sort((a, b) => b.count - a.count)
      }
    })

    await Promise.all(
      Object.keys(ranking).map((key, index) =>
        this.rakingRepository
          .save(
            this.rakingRepository.create({
              title: '가장 많은 재평가를 받은 영화 Top3',
              genre: key,
              displayOrder: index,
              condition: 'most_revaluation',
              template: 'scroll_view',
              activeAt: new Date(),
            }),
          )
          .then((rank) =>
            Promise.all(
              ranking[key].slice(0, 3).map((item, index) =>
                this.rakingItemRepository.save(
                  this.rakingItemRepository.create({
                    rankId: rank.id,
                    movieId: item.id,
                    count: item.count,
                    order: index,
                  }),
                ),
              ),
            ),
          ),
      ),
    )
  }
}
