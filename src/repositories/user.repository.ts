import config from 'config';
import db from '../db';
import User from '../models/user.model';
import DatabaseError from '../models/errors/database.error.model';

const authCryptKey = config.get<string>('authentication.cryptKey');

class UserRepository {
  async findAllUsers(): Promise<User> {
    const query = `
    SELECT uuid, username 
        FROM application_user
    `;

    const { rows } = await db.query<User>(query);
    return rows || [];
  }

  async findById(uuid: string): Promise<User> {
    try {
      const query = `
      SELECT uuid, username
      FROM application_user
      WHERE uuid = $1
      `;

      const values = [uuid];

      const { rows } = await db.query<User>(query, values);
      const [user] = rows;
      return user;
    } catch (error) {
      throw new DatabaseError('Erro na consulta por ID');
    }
  }

  async create(user: User): Promise<string> {
    try {
      const script = `
        INSERT INTO application_user (
          username,
          password
        )
        VALUES ($1, crypt($2, '${authCryptKey}'))
        RETURNING uuid
      `;

      const values = [user.username, user.password];

      const { rows } = await db.query<{ uuid: string }>(script, values);
      const [newUser] = rows;
      return newUser.uuid;
    } catch (error) {
      throw new DatabaseError('Erro ao inserir usuário');
    }
  }

  async update(user: User): Promise<string> {
    const script = `
      UPDATE application_user
      SET
        username = $1,
        password = crypt($2, '${authCryptKey}')
      WHERE uuid = $3
    `;

    const values = [user.username, user.password, user.uuid];
    await db.query<{ uuid: string }>(script, values);
  }

  async remove(uuid: string): Promise<void> {
    const script = `
      DELETE
      FROM application_user
      WHERE uuid = $1
    `;

    const values = [uuid];
    await db.query(script, values);
  }

  async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
    try {
      const query = `
        SELECT uuid, username
        FROM application_user
        WHERE username = $1
        AND password = crypt($2, '${authCryptKey}')
      `;
      const values = [username, password];
      const { rows } = await db.query<User>(query, values);
      const [user] = rows;

      return user || null;
    } catch (error) {
      throw new DatabaseError('Erro na consulta por username e password');
    }
  }
}

export default new UserRepository();
