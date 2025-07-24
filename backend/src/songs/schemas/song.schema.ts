import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type SongDocument=Song & Document;

@Schema()
export class Song{
    @Prop({required:true})
    title:string;

    @Prop({required:true})
    artist:string;

    @Prop({required:true})
    filePath:string;

    @Prop()
    duration:string;

    @Prop({default:0})
    likes:number;
}

export const SongSchema=SchemaFactory.createForClass(Song);