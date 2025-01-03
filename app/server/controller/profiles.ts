import db from '../db/mysql.config'
import { RegisterUserResponse, LoginUserResponse } from '../types/profiles.types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

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
    message: 'User registered successfully'
  };
};

const loginUser = async (email: string, password: string): Promise<LoginUserResponse> => {
  const loginQuery = `SELECT id, email, username, password FROM profiles WHERE email = ?`;

  try {
    let [result] = await db.query<RowDataPacket[]>(loginQuery, email);

    if (result.length === 0) {
      return { status: 400, error: `No profile found for ${email}. Please Register` }
    }

    if (!await bcrypt.compare(password, result[0].password)) {
      return { status: 400, error: 'Password does not match with email' };
    }

    const token = jwt.sign(
      { id: result[0].id, email: result[0].email, username: result[0].username },
      process.env.JWT_SECRET as string,
    );

    return { 
      success: true,
      statusCode: 200,
      message: 'User logged in successfully',
      token,
    };

  } catch (err: unknown) {
    if (err instanceof Error) {
      return { status: 500, error: 'An error occurred while registering the user' };
    }
  }

  return { status: 500, error: 'Unexpected error occurred' };
}

export {
  registerUser,
  loginUser
}
