export interface Client {
    id: string;
    activo: boolean;
    customFields: { [key: string]: any };
    nombre: string;
    email?: string;
    telefono?: string;
    users:Array<string>;
}
  