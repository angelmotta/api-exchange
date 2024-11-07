import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Rate } from 'src/rates/schemas/rates.schema';

export type OrderDocument = HydratedDocument<Order>;

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
export class Order {
  id?: string;

  @Prop({ required: true })
  tipoCambio: string;

  @Prop({ required: true, type: Number })
  montoEnviar: number;

  @Prop({ required: true, type: Number })
  montoRecibir: number;

  @Prop({
    type: {
      currencyPair: String,
      purchasePrice: Number,
      salePrice: Number,
      createdAt: Date,
      updatedAt: Date,
    },
    required: true,
  })
  rate: Rate; // Save a complete Snapshot of the Rate object (not the reference)

  createdAt: Date;
  updatedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ createdAt: 1 }); // Add index to createdAt field
