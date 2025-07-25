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

    @Prop({ required: true })
    uploadedBy: string;

    @Prop({ type: [{ user: String, text: String }], default: [] })
    comments: { user: string; text: string }[];

    @Prop({ type: [{ user: String, value: Number }], default: [] })
    ratings: { user: string; value: number }[];
}

export const SongSchema=SchemaFactory.createForClass(Song);