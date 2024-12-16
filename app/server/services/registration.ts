import db from '../db/mysql.config'
import { RegisterUserResponse, UserProfile } from '../types/profiles.types';
import { ResultSetHeader } from 'mysql2';

const registerUser = async (profile: UserProfile): Promise<RegisterUserResponse> => {
  const { email, username, password } = profile;

  const registerQuery = `INSERT INTO profiles 
        (email, username, password)
        VALUES 
        (?, ?, ?)`;

  try {
    let [result] = await db.query<ResultSetHeader>(registerQuery, [email, username, password]);

    if (result.affectedRows) {
      return { status: 400, error: 'Fails to register user' };
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
        } else if (mysqlError.code === 'ER_CHECK_CONSTRAINT_VIOLATED') {
          if (mysqlError.sqlMessage.includes('CK_PASSWORD_LENGTH')) {
            return { status: 400, error: `Password needs to be between 8 to 64 characters long`};
          }
        }
      }
    }

    return { status: 500, error: 'An error occurred while registering the user' };
  }

  return { success: 'User registered successfully' };
};

export { registerUser }
