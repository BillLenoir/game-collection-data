import { dataConfigs } from "../utils/data.config";
import type {
  BggRegularEntity,
  BggGameDataFromSingleCallJustTheGame,
  DataResponse,
  EntityData,
  RoleData,
} from "../utils/data.types";
import { idGenerator } from "../utils/generate-id";

export class GameRelationshipProcessor {
  private readonly rolesWeCareAbout = new Set(
    Object.keys(dataConfigs.rolesToExtract),
  );

  private entities: EntityData[] = [];
  private roles: RoleData[] = [];
  private seenRoles = new Set<string>();
  private seenEntityRoleCombo = new Set<string>();

  public processGameRelationships = async (
    gameData: BggGameDataFromSingleCallJustTheGame,
  ): Promise<DataResponse<string>> => {
    const bggGameId = gameData._attributes.objectid;

    for (const [roleName, roleValue] of Object.entries(gameData)) {
      if (!this.shouldProcessRole(roleName, roleValue)) continue;

      this.recordRole(roleName);
      this.processEntities({
        bggGameId,
        roleName,
        entities: roleValue as BggRegularEntity | BggRegularEntity[],
      });
    }

    return {
      ok: true,
      data: "No data to return",
      message: `Processed relationships for BGG game ID: ${bggGameId}`,
    };
  };

  private shouldProcessRole(roleName: string, roleValue: unknown): boolean {
    if (!roleValue) return false;
    if (!this.rolesWeCareAbout.has(roleName)) return false;
    return true;
  }

  private recordRole(roleName: string): void {
    if (this.seenRoles.has(roleName)) return;

    this.roles.push({
      id: idGenerator.generateId(),
      name: roleName,
    });
    this.seenRoles.add(roleName);
  }

  private processEntities({
    bggGameId,
    roleName,
    entities,
  }: {
    bggGameId: string;
    roleName: string;
    entities: BggRegularEntity | BggRegularEntity[];
  }): void {
    const items = Array.isArray(entities) ? entities : [entities];

    for (const entity of items) {
      const entityName = (entity._text ?? "").trim();
      if (!entityName) continue;

      const comboKey = `${bggGameId}:${roleName}:${entityName}`;
      if (this.seenEntityRoleCombo.has(comboKey)) continue;

      this.seenEntityRoleCombo.add(comboKey);

      this.entities.push({
        id: idGenerator.generateId(),
        bggId: entity._attributes.objectid,
        name: entityName,
      });
    }
  }

  get listOfEntities(): ReadonlyArray<EntityData> {
    return this.entities;
  }

  get listOfRoles(): ReadonlyArray<RoleData> {
    return this.roles;
  }

  clear(): void {
    this.entities = [];
    this.roles = [];
    this.seenRoles.clear();
    this.seenEntityRoleCombo.clear();
  }
}

export const gameRelationshipProcessor = new GameRelationshipProcessor();
