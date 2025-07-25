import { Injectable } from '@nestjs/common';
import { Song, SongDocument } from './schemas/song.schema';
import { Model, set } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SongsService {
    constructor(
        @InjectModel(Song.name) private songModel:Model<SongDocument>,
    ){}

    async createSong(title: string, artist: string, filePath: string,userId: string): Promise<Song> {
        const newSong = new this.songModel({ title, artist, filePath ,uploadedBy:userId});
        return newSong.save();
    }

    async getAllSongs(): Promise<Song[]> {
        return this.songModel.find();
    }

    async getSongByfilePath(filepath:string){
        return this.songModel.find({filePath:filepath})
    }

    async updateSongLikes(id: string) {
        const result= await this.songModel.findOneAndUpdate(
            { _id: id },
            { $inc: { likes: 1 } },
            { new: true }
        );
        return result;
    }

    async getSongsByUser(userId: string) {
        return this.songModel.find({ uploadedBy: userId });
    }

    async addComment(songId: string, userId: string, comment: string) {
    return this.songModel.findByIdAndUpdate(
        songId,
        { $push: { comments: { user: userId, text: comment } } },
        { new: true }
    );
    }

    async addRating(songId: string, userId: string, value: number) {
    return this.songModel.findByIdAndUpdate(
        songId,
        { $push: { ratings: { user: userId, value } } },
        { new: true }
    );
    }



}
