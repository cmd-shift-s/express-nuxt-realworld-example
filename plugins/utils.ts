
export function getFieldsValue(target: HTMLFormElement, ...fields: string[]) {
  const obj = {}
  fields.forEach(field => obj[field] = target[field].value)
  return obj
}
