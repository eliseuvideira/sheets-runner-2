declare namespace NodeJS {
  export interface ProcessEnv {
    // Environment
    NODE_ENV: "development" | "test" | "production" | "staging";
    PORT: string;

    // Api
    API_NAME: string;
    API_TOKEN: string;
    API_IMAGE: string;

    // Google
    GOOGLE_AUTH_CLIENT_EMAIL: string;
    GOOGLE_AUTH_PRIVATE_KEY: string;
    GOOGLE_SHEETS_SPREADSHEET_ID: string;

    // Twitter
    TWITTER_USERNAME: string;
    TWITTER_BEARER_TOKEN: string;

    // Locale
    LANG: string;
  }
}
