import type  ProducedItemDTO  from "./ProducedItemDTO";
import type ProductRawMaterialDTO from "./ProductRawMaterialDTO";

export default interface SimulationResponseDTO {
    producedItems: ProducedItemDTO[];
    rawMaterialsUsed: ProductRawMaterialDTO[];
    totalSimulationValue: number;
}