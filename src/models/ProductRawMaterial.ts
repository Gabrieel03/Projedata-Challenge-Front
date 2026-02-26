import type Product from "./Product";
import type RawMaterial from "./RawMaterial";

export default interface ProductRawMaterial {
    id: number;
    product: Product;
    rawMaterial: RawMaterial;
    quantityNeeded: number;
}