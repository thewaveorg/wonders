export const validateWondersJson = (obj: object): true | string => {
  /**
   * A wonders.json needs to have:
   * - name: string,
   * - description: string,
   * - author: string,
   * - version: string,
   * - entry: string,
   */

  let required = {
    name: "string",
    description: "string",
    author: "string",
    version: "string",
    entry: "string",
    icon: "string",
  };

  let keys = Object.keys(obj);
  let entries = Object.entries(required);

  for (let [requiredKey, requiredValue] of entries) {
    if (!keys.includes(requiredKey))
      return `Lacking required property ${requiredKey}.`;

    let value = Object.entries(obj).find((v) => v[0] == requiredKey) ![1];
    if (typeof (value) != requiredValue)
      return `Wrong type given to property ${requiredKey}. (Expected ${requiredValue}, got ${value})`;
  }

  return true;
}
