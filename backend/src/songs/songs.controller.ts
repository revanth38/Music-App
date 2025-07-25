import { Controller, Post, UseInterceptors, UploadedFile, Body, Put, UseGuards, Req, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SongsService } from './songs.service';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import * as fs from 'fs';
import { Response } from 'express';
import * as path from 'path';

@Controller('songs')
export class SongsController {
    constructor(private readonly songsService: SongsService) {}
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
        }),
    }))
    async uploadSong(
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
        @Body('artist') artist: string,
    ) {
        const filePath = file.path;
        return this.songsService.createSong(title, artist, filePath);
    }

    @Post('allsongs')
    async getallsongs(){
        return this.songsService.getAllSongs();
    }

    @Post('getSongById')
    async getSongById(@Body('filePath') filepath:string){
        return this.songsService.getSongByfilePath(filepath);
    }

    // @UseGuards(JwtAuthGuard)
    @Put('updateLike')
    async updateLikes(@Body('id') id: string){
        return this.songsService.updateSongLikes(id);
    }


    @Get('stream/:filename')
    async streamSong(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

        if (!fs.existsSync(filePath)) {
        throw new NotFoundException('Song not found');
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = res.req.headers.range;

        if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

        const chunkSize = end - start + 1;
        const file = fs.createReadStream(filePath, { start, end });

        res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'audio/mpeg',
        });

        file.pipe(res);
        } else {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'audio/mpeg',
        });
        fs.createReadStream(filePath).pipe(res);
        }
    }
}
