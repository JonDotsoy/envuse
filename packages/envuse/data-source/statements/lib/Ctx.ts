import { StringifyOptions } from "./stringify-options";

export class Ctx {
  #used: boolean = false;
  #options?: StringifyOptions;

  get used() {
    return this.#used;
  }

  get options() {
    return this.#options;
  }

  start(options?: StringifyOptions) {
    this.#options = options;

    if (this.#used) {
      throw new Error("Cannot start twice");
    }

    this.#used = true;
  }

  end() {
    this.#options = undefined;

    if (!this.#used) {
      throw new Error("Cannot end before start");
    }

    this.#used = false;
  }
}
