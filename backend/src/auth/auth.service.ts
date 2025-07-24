import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService:JwtService
    ){}

    async register(username:string,email:string,password:string){
        const hashed=await bcrypt.hash(password,10);
        const newUser=new this.userModel({username:username,email:email,password:hashed});
        console.log({username,password,email});
        return newUser.save();
    }

    async login(email:string,password:string){
        const user=await this.userModel.findOne({email});
        if(!user) 
            throw new UnauthorizedException('User not found');
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid)
            throw new UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ id: user._id, email: user.email });
        return {token};
    }

    async getProfile(userId: string) {
        return this.userModel.findById(userId).select('-password');
    }
}
