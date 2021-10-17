import { FilesService } from "./files.service";

describe("FilesService", () => {
  let service: FilesService;

  beforeEach(async () => {
    service = new FilesService();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
