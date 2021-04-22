import mongoose, { Schema, Document } from 'mongoose';

/**
 * Interface to represent Car Manufacturer
 */
export interface Manufacturer extends Document {
    companyName: string;
    country: string;
    factoryLocation: number[];
}

/**
 * Define Car Manufacturer mongoose internal model Schema.
 */
export const ManufacturerModelSchema: Schema = new Schema({
    companyName: { type: String, required: true },
    country: { type: String, required: true },
    factoryLocation: { type: [Number], required: true },
});

export const ManufacturerModel = mongoose.model<Manufacturer>('Manufacturer', ManufacturerModelSchema);
