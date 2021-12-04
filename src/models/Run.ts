import { Row } from "./Row";

export interface Run {
  started_at: Date;
  successful: boolean;
  error?: { message: string } | null;
  items?: Partial<Row>[];
}
