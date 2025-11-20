import type {
  EntityData,
  ExtractedEntities,
  DataResponse,
  StepFunction,
} from "../utils/data.types";
import { idGenerator } from "../utils/generate-id";

export class EntityProcessor {
  private processedEntities: EntityData[] = [];
  private seen = new Set<string>();

  private defaultKeyOf = (bggId: string, name: string) =>
    `${bggId}::${name.trim().toLowerCase()}`;

  processExtractedEntities(extractedEntities: ExtractedEntities): void {
    for (const extractedEntity of extractedEntities) {
      const name = (extractedEntity.name ?? "").trim();
      const key = this.defaultKeyOf(extractedEntity.bggId, name);

      if (this.seen.has(key)) continue;

      const newEntity: EntityData = {
        id: idGenerator.generateId(),
        bggId: extractedEntity.bggId,
        name,
      };
      this.seen.add(key);
      this.processedEntities.push(newEntity);
    }
  }

  get listOfProcessedEntities(): ReadonlyArray<EntityData> {
    return [...this.processedEntities];
  }

  clear(): void {
    this.processedEntities = [];
    this.seen.clear();
  }

  // 👇 StepFunction-compatible method
  processExtractedEntitiesStep: StepFunction<
    ExtractedEntities,
    ReadonlyArray<EntityData>
  > = async (extractedEntities) => {
    // optional: decide whether to clear or accumulate
    this.clear();
    this.processExtractedEntities(extractedEntities);

    const result = this.listOfProcessedEntities;

    const response: DataResponse<ReadonlyArray<EntityData>> = {
      ok: true,
      data: result,
      message: `Processed ${result.length} entities`,
    };

    return response;
  };
}

export const entityProcessor = new EntityProcessor();
