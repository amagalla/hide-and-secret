export class MySQLError extends Error {
    code?: string;
    sqlMessage?: string;

    constructor(sqlMessage: string, code: string) {
        super(sqlMessage);

        this.name = 'MySQL Error';
        this.code = code;
        this.sqlMessage = sqlMessage;
    }
}