import { Controller, Get, Post, Query, Body, Patch, Param, Delete, Req, Res, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';

import { MovieService } from './movie.service';
import { CreateMovieDto } from '../../dto/create-movie.dto';
import { UpdateMovieDto } from '../../dto/update-movie.dto';

@Controller('movie')
export class MovieController {
  constructor(private readonly moviesService: MovieService) {}

  //get movie 이름으로
  @UseInterceptors(ClassSerializerInterceptor) 
  @Get('/search')///////여기 수정 필요
  async searchMovie(
    @Query('name') name: string
  ){

    const searchRes =  await this.moviesService.searchMovie( name );
    return searchRes;
    // try {

    //   const searchRes =  await this.moviesService.searchMovie( name );

    //   return searchRes;
    // }catch(err){
    //   console.log(err);
    //   // 에러 처리 필요
    //   // if (err.name === 'TokenExpiredError') {
    //   //   return {
    //   //     code: 419,
    //   //     message: '토큰이 만료되었습니다.'
    //   //   }
    //   // }
    //   // return res.status(401).json({
    //   //   code: 401,
    //   //   message: "유효하지 않은 토큰입니다.",
    //   // })
    // }
  }

}
