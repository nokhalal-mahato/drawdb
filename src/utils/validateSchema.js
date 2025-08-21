import { Validator } from "jsonschema";
import { jsonSchema } from "../data/schemas";

export function jsonDiagramIsValid(obj) {
  return new Validator().validate(obj, jsonSchema).valid;
}
