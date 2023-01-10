const { getMissingParameter } = require("../utils/missing-parameters");

test("returns an array of missing parameters", () => {
  const object = {
    key1: "value1",
    key2: "",
    key3: null,
  };
  expect(getMissingParameter(object)).toEqual(["key2", "key3"]);
});

test("returns false if no parameter is missing", () => {
  const object = {
    key1: "value1",
    key2: "value2",
    key3: "value3",
  };
  expect(getMissingParameter(object)).toBe(false);
});
