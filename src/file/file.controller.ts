import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Put,
  Query,
  Res
} from '@nestjs/common';
import {
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import { W_OK } from 'constants';
import * as fs from 'fs';
import * as path from 'path';
import { Stream } from 'stream';
import { FileService } from './file.service';
import { FastifyReply } from 'fastify';
import {
  SWAGGER_DESC_DELETE_FILE,
  SWAGGER_DESC_READ_FILE,
  SWAGGER_DESC_READ_FILE_ON_SERVER,
  SWAGGER_DESC_SAVE_RAW_CONTENT
} from './file.controller.swagger.desc';
import { CloudProvidersMetaData } from './cloud.providers.metadata';

@Controller('/api/file')
@ApiTags('Files controller')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private fileService: FileService) {}

  private getContentType(contentType: string) {
    if (contentType) {
      return contentType;
    } else {
      return 'application/octet-stream';
    }
  }

  private async loadCPFile(cpBaseUrl: string, filePath: string) {
    if (!filePath.startsWith(cpBaseUrl)) {
      throw new BadRequestException(`Invalid parameter 'path' ${filePath}`);
    }

    const file: Stream = await this.fileService.getFile(filePath);

    return file;
  }

  private isValidPath(filePath: string): boolean {
    // Implement a whitelist of allowed paths or patterns
    const allowedPaths = ['config/products/crystals/'];
    return allowedPaths.some(allowedPath => filePath.startsWith(allowedPath));
  }

  private isValidContentType(contentType: string): boolean {
    // Implement a whitelist of allowed content types
    const allowedContentTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    return allowedContentTypes.includes(contentType);
  }

  @Get('/aws')
  @ApiQuery({
    name: 'path',
    example: 'config/products/crystals/amethyst.jpg',
    required: true
  })
  @ApiQuery({ name: 'type', example: 'image/jpg', required: true })
  @ApiHeader({ name: 'accept', example: 'image/jpg', required: true })
  @ApiOkResponse({
    description: 'File read successfully'
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        location: { type: 'string' }
      }
    }
  })
  @ApiOperation({
    description: SWAGGER_DESC_READ_FILE
  })
  async loadAwsFile(
    @Query('path') filePath: string,
    @Query('type') contentType: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    if (!this.isValidPath(filePath)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!this.isValidContentType(contentType)) {
      throw new BadRequestException('Invalid content type');
    }

    const file: Stream = await this.loadCPFile(
      CloudProvidersMetaData.AWS,
      filePath
    );
    const type = this.getContentType(contentType);
    res.type(type);

    return file;
  }

  @Get('/azure')
  @ApiQuery({
    name: 'path',
    example: 'config/products/crystals/amethyst.jpg',
    required: true
  })
  @ApiQuery({ name: 'type', example: 'image/jpg', required: true })
  @ApiHeader({ name: 'accept', example: 'image/jpg', required: true })
  @ApiOkResponse({
    description: 'File read successfully'
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        location: { type: 'string' }
      }
    }
  })
  @ApiOperation({
    description: SWAGGER_DESC_READ_FILE
  })
  async loadAzureFile(
    @Query('path') filePath: string,
    @Query('type') contentType: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    if (!this.isValidPath(filePath)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!this.isValidContentType(contentType)) {
      throw new BadRequestException('Invalid content type');
    }

    const file: Stream = await this.loadCPFile(
      CloudProvidersMetaData.AZURE,
      filePath
    );
    const type = this.getContentType(contentType);
    res.type(type);

    return file;
  }

  @Get('/digital_ocean')
  @ApiQuery({
    name: 'path',
    example: 'config/products/crystals/amethyst.jpg',
    required: true
  })
  @ApiQuery({ name: 'type', example: 'image/jpg', required: true })
  @ApiHeader({ name: 'accept', example: 'image/jpg', required: true })
  @ApiOkResponse({
    description: 'File read successfully'
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        location: { type: 'string' }
      }
    }
  })
  @ApiOperation({
    description: SWAGGER_DESC_READ_FILE
  })
  async loadDigitalOceanFile(
    @Query('path') filePath: string,
    @Query('type') contentType: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    if (!this.isValidPath(filePath)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!this.isValidContentType(contentType)) {
      throw new BadRequestException('Invalid content type');
    }

    // Ensure the file path is not a URL
    if (/^https?:\/\//.test(filePath)) {
      throw new BadRequestException('Remote URLs are not allowed');
    }

    const file: Stream = await this.fileService.getFile(filePath);
    const type = this.getContentType(contentType);
    res.type(type);

    return file;
  }

  @Get()
  @ApiQuery({
    name: 'path',
    example: 'config/products/crystals/amethyst.jpg',
    required: true
  })
  @ApiQuery({ name: 'type', example: 'image/jpg', required: true })
  @ApiHeader({ name: 'accept', example: 'image/jpg', required: true })
  @ApiOkResponse({
    description: 'File read successfully'
  })
  @ApiInternalServerErrorResponse({
    schema: {
      type: 'object',
      properties: {
        error: { type: 'string' },
        location: { type: 'string' }
      }
    }
  })
  @ApiOperation({
    description: SWAGGER_DESC_READ_FILE
  })
  async loadFile(
    @Query('path') filePath: string,
    @Query('type') contentType: string,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    if (!this.isValidPath(filePath)) {
      throw new BadRequestException('Invalid file path');
    }

    if (!this.isValidContentType(contentType)) {
      throw new BadRequestException('Invalid content type');
    }

    // Ensure the file path is not a URL
    if (/^https?:\/\//.test(filePath)) {
      throw new BadRequestException('Remote URLs are not allowed');
    }

    // Resolve the file path to prevent directory traversal
    const resolvedPath = path.resolve('config/products/crystals', filePath);
    if (!resolvedPath.startsWith(path.resolve('config/products/crystals'))) {
      throw new BadRequestException('Invalid file path');
    }

    const file: Stream = await this.fileService.getFile(resolvedPath);
    const type = this.getContentType(contentType);
    res.type(type);

    return file;
  }

  // Other methods remain unchanged
}
