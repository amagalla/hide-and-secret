import db from '../db/mysql.config'
import { RegisterUserResponse, UserProfile } from '../types/profiles.types';
import { ResultSetHeader } from 'mysql2';

const registerUser = async (email: string, username: string, password: string): Promise<RegisterUserResponse> => {
  const registerQuery = `INSERT INTO profiles 
        (email, username, password)
        VALUES 
        (?, ?, ?)`;

  try {
    let [result] = await db.query<ResultSetHeader>(registerQuery, [email, username, password]);

    if (result.affectedRows === 0) {
      return { status: 400, error: 'Failed to register user' };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      const mysqlError = err as { code?: string; sqlMessage?: string };

      if (mysqlError.sqlMessage) {
        if (mysqlError.code === 'ER_DUP_ENTRY') {
          if (mysqlError.sqlMessage.includes('profiles.email')) {
            return { status: 400, error: `Email ${email} already exists` };
          } else if (mysqlError.sqlMessage.includes('profiles.username')) {
            return { status: 400, error: `Username ${username} already exists` };
          }
        }
      }
    }

    return { status: 500, error: 'An error occurred while registering the user' };
  }

  return { 
    success: true,
    statusCode: 200,
    message: 'User registered successfully' };
};

export { registerUser }
