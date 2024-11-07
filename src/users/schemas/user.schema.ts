import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';

@Schema({ 
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password; // No password in the response
        }
    }
})
export class User extends Document {
    id?: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Mongoose middleware to hash the password before saving the user document to the database
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.index({ email: 1 }, { unique: true });