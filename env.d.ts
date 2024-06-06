declare global {
    namespace NodeJS {
      interface ProcessEnv {
        MONGODB_URI: string;
        // add more environment variables and their types here
      }
    }
  }
  export{}