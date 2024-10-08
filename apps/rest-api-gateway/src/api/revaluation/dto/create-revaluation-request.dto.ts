import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export class CreateRevaluationRequestDto {
  @ApiProperty({ example: 'F-0000', description: 'MOVIE ID + MOVIE SEQ' })
  @IsNotEmpty()
  @IsString()
  movieId: string

  @ApiPropertyOptional({ example: 4.5, description: 'Number of Stars', type: Number })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.5)
  @Max(5.0)
  numStars: number

  @ApiPropertyOptional({
    example: 'PLANNING_INTENT',
    description: 'Special Point',
    enum: [
      'PLANNING_INTENT',
      'DIRECTORS_DIRECTION',
      'ACTING_SKILLS',
      'SCENARIO',
      'OST',
      'SOCIAL_ISSUES',
      'VISUAL_ELEMENT',
      'SOUND_ELEMENT',
    ],
  })
  @IsNotEmpty()
  @IsEnum([
    'PLANNING_INTENT',
    'DIRECTORS_DIRECTION',
    'ACTING_SKILLS',
    'SCENARIO',
    'OST',
    'SOCIAL_ISSUES',
    'VISUAL_ELEMENT',
    'SOUND_ELEMENT',
  ])
  specialPoint: string

  @ApiPropertyOptional({
    example: 'POSITIVE',
    description: 'Past Valuation',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
  })
  @IsNotEmpty()
  @IsEnum(['POSITIVE', 'NEGATIVE', 'NOT_SURE'])
  pastValuation: string

  @ApiPropertyOptional({
    example: 'POSITIVE',
    description: 'Present Valuation',
    enum: ['POSITIVE', 'NEGATIVE', 'NOT_SURE'],
  })
  @IsNotEmpty()
  @IsEnum(['POSITIVE', 'NEGATIVE', 'NOT_SURE'])
  presentValuation: string

  @ApiPropertyOptional({ example: 'This is a comment', description: 'Comment' })
  @IsOptional()
  @IsString()
  comment: string

  requestUserId: string
}
