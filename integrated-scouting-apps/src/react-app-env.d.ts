declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT: string;
      DATABASE_URL: string;
      // add more environment variables and their types here
    }
  }
}