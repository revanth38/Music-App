import { Controller, Post, UseInterceptors, UploadedFile, Body, Put, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { SongsService } from './songs.service';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
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

    @UseGuards(JwtAuthGuard)
    @Put('updateLike')
    async updateLikes(@Body('id') id: string){
        return this.songsService.updateSongLikes(id);
    }
}
