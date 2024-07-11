import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MovieEntity } from '../../entity/movie.entity'
import { Repository } from 'typeorm'

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private movieRepository: Repository<MovieEntity>,
  ) {}

  //영화 호출
  async searchMovie(name: string) {
    // const title = name
    // const kmdbKey = configurations().kmdbKey
    // const url = `http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&
    // detail=Y&listCount=500&title=${title}&ServiceKey=${kmdbKey}`
    //
    // const data: { Data } = await firstValueFrom(
    //   this.httpService.post(url).pipe(
    //     catchError((error: AxiosError) => {
    //       console.log('error', error)
    //       throw 'An error happened!'
    //     }),
    //   ),
    // )
    //
    // let resDataArr = []
    // if (data.Data[0].TotalCount > 0) {
    //   for (var i = 0; i < data.Data[0].Result.length; i++) {
    //     let createMovieDto = new CreateMovieDto()
    //     createMovieDto.id = data.Data[0].Result[i].DOCID
    //     createMovieDto.provider = 'kmdb'
    //     let title = data.Data[0].Result[i].title.replace(/\!HS/g, '') // !HS를 빈문자열로 replace
    //     title = title.replace(/\!HE/g, '') // !HE를 빈문자열로 replace
    //     title = title.replace(/^\s+|\s+$/g, '') // 앞뒤 공백 제거
    //     title = title.replace(/ +/g, ' ') // 여러개의 공백 하나의 공백으로 바꾸기
    //     createMovieDto.name = title
    //     createMovieDto.nameOrg = data.Data[0].Result[i].titleOrg
    //     createMovieDto.prodYear = data.Data[0].Result[i].prodYear
    //     createMovieDto.genre = data.Data[0].Result[i].genre
    //     let posterStr = data.Data[0].Result[i].posters
    //     let posterlist = posterStr.split('|')
    //     createMovieDto.poster = posterlist[0]
    //
    //     let directorArr = []
    //     data.Data[0].Result[i].directors.director.forEach((director) => {
    //       directorArr.push(director.directorNm)
    //     })
    //     createMovieDto.director = directorArr.join()
    //
    //     let actorArr = []
    //     data.Data[0].Result[i].actors.actor.forEach((actor) => {
    //       actorArr.push(actor.actorNm)
    //     })
    //     createMovieDto.actor = actorArr.join()
    //
    //     //resData 제외한 response 값
    //     let resDto = new CreateMovieDto()
    //     resDto.id = data.Data[0].Result[i].DOCID
    //     resDto.provider = 'kmdb'
    //     resDto.actor = actorArr.join()
    //     resDto.name = title
    //     resDto.prodYear = data.Data[0].Result[i].prodYear
    //     resDto.genre = data.Data[0].Result[i].genre
    //     resDto.poster = posterlist[0]
    //     resDto.director = directorArr.join()
    //
    //     resDataArr.push(resDto)
    //     createMovieDto.resData = data.Data[0].Result[i]
    //     this.movieRepository.save(createMovieDto)
    //   }
    // }

    return null
    //return { ...resDataArr };
  }
}
