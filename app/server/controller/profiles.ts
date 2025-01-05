import db from '../db/mysql.config'
import { RegisterUserResponse, LogUserResponse } from '../types/profiles.types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

const registerUser = async (email: string, password: string): Promise<RegisterUserResponse> => {
  const registerQuery = `INSERT INTO profiles 
        (email, password)
        VALUES 
        (?, ?)`;


  try {
    let [result] = await db.query<ResultSetHeader>(registerQuery, [email, password]);

    if (result.affectedRows === 0) {
      return { status: 400, error: 'Failed to register user' };
    }

    return {
      success: true,
      statusCode: 200,
      message: 'User registered successfully',
      id: result.insertId
    };
  } catch (err: unknown) {

    if (err instanceof Error) {
      const mysqlError = err as { code?: string; sqlMessage?: string };

      if (mysqlError.sqlMessage) {
        if (mysqlError.code === 'ER_DUP_ENTRY') {
          if (mysqlError.sqlMessage.includes('profiles.email')) {
            return { status: 400, error: `Email ${email} already exists` };
          }
        }
      }
    }
    return { status: 500, error: 'An error occurred while registering the user' };
  }
};

const loginUser = async (email: string, password: string): Promise<LogUserResponse> => {
  const loginQuery = `SELECT id, email, username, password, has_username FROM profiles WHERE email = ?`;

  try {
    let [result] = await db.query<RowDataPacket[]>(loginQuery, email);

    if (result.length === 0) {
      return { status: 400, error: `No profile found for ${email}. Please Register` }
    }

    if (!await bcrypt.compare(password, result[0].password)) {
      return { status: 400, error: 'Password does not match with email' };
    }

    if (!result[0].username) {
      return {
        success: true,
        statusCode: 200,
        has_username: result[0].has_username,
        message: 'Tranfer user to username page',
        user: {
          id: result[0].id,
          email: result[0].email,
        }
      };
    }

    const token = jwt.sign(
      { id: result[0].id, email: result[0].email, username: result[0].username },
      process.env.JWT_SECRET as string,
    );

    return {
      success: true,
      statusCode: 200,
      has_username: result[0].has_username,
      message: 'User logged in successfully',
      token,
      user: {
        id: result[0].id,
        email: result[0].email,
        username: result[0].username
      }
    };

  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: 500, error: 'An error occurred while registering the user' };
    }
  }

  return { status: 500, error: 'Unexpected error occurred' };
}

const registerUsername = async (id: string, username: string): Promise<LogUserResponse> => {
  const checkValidUsername = 'SELECT id FROM profiles WHERE username = ?';
  const updateQuery = 'UPDATE profiles SET username = ?, has_username = TRUE WHERE id = ?';
  const getProfile = 'SELECT id, email, google_id, google_email, username FROM profiles WHERE id = ?';

  try {
    const [checkUser] = await db.query<RowDataPacket[]>(checkValidUsername, username);

    if (checkUser.length > 0) {
      return { status: 400, error: `Username ${username} already in use. Please choose another` };
    };

    const [updatedUsername] = await db.query<ResultSetHeader>(updateQuery, [username, id]);

    if (updatedUsername.affectedRows === 0) {
      return { status: 400, error: `User ${username} not found` };
    }

    const [result] = await db.query<RowDataPacket[]>(getProfile, [id]);

    const token = jwt.sign(
      { id: result[0].id, email: result[0].email, username: result[0].username },
      process.env.JWT_SECRET as string,
    );

    return {
      success: true,
      statusCode: 200,
      message: 'Username updated successfully',
      token,
      user: {
        id: result[0].id,
        email: result[0].email,
        username: result[0].username
      }
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: 500, error: 'Unexpected error occured when updating username' };
    }
  }

  return { status: 500, error: 'Unexpected error occurred' };
}

export {
  registerUser,
  loginUser,
  registerUsername
}
