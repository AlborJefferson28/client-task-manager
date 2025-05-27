export interface ITableColumns {
  field: string;
  header: string;
  custom?: (data: any) => string;
}