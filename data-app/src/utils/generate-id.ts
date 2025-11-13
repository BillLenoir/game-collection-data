class IdGenerator {
  private gameId: number;

  constructor() {
    this.gameId = 1;
  }

  generateId(): string {
    return String(this.gameId++);
  }
}

// To make sure there is only ever one instance
// of this class out there.
export const idGenerator = new IdGenerator();
