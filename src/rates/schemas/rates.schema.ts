import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
    // This transformer helps standardize the response format
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
})
export class Rate extends Document {
    id?: string;

    @Prop({ required: true, unique: true })
    currencyPair: string;

    @Prop({ required: true, type: Number })
    purchasePrice: number;

    @Prop({ required: true, type: Number })
    salePrice: number;

    createdAt: Date;
    updatedAt: Date;
}

export const RateSchema = SchemaFactory.createForClass(Rate);

RateSchema.index({ currencyPair: 1 }, { unique: true }); // create unique index to currencyPair field
