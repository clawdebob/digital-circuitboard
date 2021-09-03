export enum ELEMENT {
  OR = 'Or',
  AND = 'And',
  NOR = 'Nor',
  NAND = 'Nand',
  XOR = 'Xor',
  NXOR = 'Nxor',
  WIRE = 'Wire',
  CONSTANT = 'Constant',
  BUTTON = 'Button',
  INVERTOR = 'Invertor',
  BUFFER = 'Buffer',
  OUT_CONTACT = 'OutContact',
  LABEL = 'Label'
}

export type DcbElementName = ELEMENT.OR
  | ELEMENT.AND
  | ELEMENT.NOR
  | ELEMENT.NAND
  | ELEMENT.XOR
  | ELEMENT.NXOR
  | ELEMENT.WIRE
  | ELEMENT.CONSTANT
  | ELEMENT.BUTTON
  | ELEMENT.INVERTOR
  | ELEMENT.BUFFER
  | ELEMENT.OUT_CONTACT
  | ELEMENT.LABEL;
