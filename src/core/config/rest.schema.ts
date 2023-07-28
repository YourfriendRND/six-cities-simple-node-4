import convict from 'convict';
import validators from 'convict-format-with-validator';

convict.addFormats(validators);

export type RestSchema = {
  PORT: number;
  DB_HOST: string;
  SALT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: string;
  DB_NAME: string;
  UPLOAD_DIR: string;
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 5000,
  },
  DB_HOST: {
    doc: 'IP addfess of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null,
  },
  DB_USER: {
    doc: 'User name for connection to database',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Password for connection to database',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_NAME: {
    doc: 'Database name',
    format: String,
    env: 'DB_NAME',
    default: null
  },
  DB_PORT: {
    doc: 'Port for database connection',
    format: 'port',
    env: 'DB_PORT',
    default: '27017'
  },
  UPLOAD_DIR: {
    doc: 'Directory for uploading client\'s files',
    format: String,
    env: 'UPLOAD_DIR',
    default: null
  }
});
