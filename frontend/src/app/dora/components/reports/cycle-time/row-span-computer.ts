/**
 * computes row spans on individual table columns
 */
export class RowSpanComputer {
  /**
   * @param data table data
   * @param columns names of left-to-right located columns, row spans must be computed for
   */
  compute(data: object[], columns: string[]): Array<Span[]> {
    const spans: Array<Span[]> = this.initSpans(columns);
    const spanColumnContexts: SpanColumnContext[] = new Array(columns.length);
    for (const row of data) {
      for (let iCol = 0; iCol < columns.length; iCol++) {
        const column = columns[iCol];
        const spanColumnContext = spanColumnContexts[iCol];
        if (spanColumnContext && spanColumnContext.spannedRow[column] === row[column]) {
          ++spanColumnContext.span.span;
          spans[iCol].push({ span: 0 });
        } else {
          const span = { span: 1 };
          spanColumnContexts[iCol] = { span, spannedRow: row };
          spans[iCol].push(span);
          spanColumnContexts.slice(iCol + 1).forEach((c) => (c.spannedRow = {}));
        }
      }
    }
    return spans;
  }

  private initSpans(columns: string[]): Array<Span[]> {
    const spans: Array<Span[]> = [];
    columns.forEach((p) => spans.push([]));
    return spans;
  }
}

export interface Span {
  span: number;
}

interface SpanColumnContext {
  span: Span;
  spannedRow: object;
}
