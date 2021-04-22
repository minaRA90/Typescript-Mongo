import mongoose, { Schema, Document } from 'mongoose';
import { Manufacturer, ManufacturerModelSchema } from './Manufacturer';

/**
 * Interface to represent car with its different properties.
 */
export interface Car extends Document {
    manufacturer: Manufacturer;
    brand: string;
    color: string;
    carModel?: string;
}

/**
 * Car mongoose model internal Schema (schema used to validate mongoose model).
 */
const CarModelSchema: Schema = new Schema({
    manufacturer: { type: ManufacturerModelSchema, required: true },
    brand: { type: String, required: true },
    color: { type: String, required: true },
    carModel: { type: String },
});

export const CarModel = mongoose.model<Car>('Car', CarModelSchema);
