import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class CreateRevaluationRequestDto {
  @ApiProperty({ example: 'F-0000', description: 'MOVIE ID + MOVIE SEQ' })
  @IsOptional()
  @IsString()
  movieId: string

  @ApiPropertyOptional({ example: 4.5, description: 'Number of Stars', type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  numStars: number

  @ApiPropertyOptional({
    example: 'PLANNING_INTENT',
    description: 'Special Point',
    enum: ['PLANNING_INTENT', 'DIRECTORS_DIRECTION', 'ACTING_SKILLS', 'SCENARIO', 'OST', 'SOCIAL_ISSUES'],
  })
  @IsOptional()
  @IsEnum(['PLANNING_INTENT', 'DIRECTORS_DIRECTION', 'ACTING_SKILLS', 'SCENARIO', 'OST', 'SOCIAL_ISSUES'])
  specialPoint: string

  @ApiPropertyOptional({
    example: 'POSITIVE',
    description: 'Past Valuation',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
  })
  @IsOptional()
  @IsEnum(['POSITIVE', 'NEGATIVE', 'NOT_SURE'])
  pastValuation: string

  @ApiPropertyOptional({
    example: 'POSITIVE',
    description: 'Present Valuation',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
  })
  @IsOptional()
  @IsEnum(['POSITIVE', 'NEGATIVE', 'NOT_SURE'])
  presentValuation: string

  @ApiPropertyOptional({ example: 'This is a comment', description: 'Comment' })
  @IsOptional()
  @IsString()
  comment: string

  requestUserId: string
}
