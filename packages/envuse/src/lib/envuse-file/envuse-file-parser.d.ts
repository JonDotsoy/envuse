/// <reference types="node" />
import { Block } from "./statements/Root";
/** AST Parser */
export declare class EnvuseFileParser {
    private filename;
    private body;
    constructor(filename: string, body: Buffer);
    toAstBody(): Block;
}
