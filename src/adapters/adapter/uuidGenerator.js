import { randomUUID } from 'crypto'

export class UuidAdapter {
  generate() {
    return randomUUID()
  }
}
