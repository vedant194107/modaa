declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(path: string);
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): Statement;
  }

  export class Statement {
    run(...args: any[]): any;
    get(...args: any[]): any;
    all(...args: any[]): any[];
  }
}
