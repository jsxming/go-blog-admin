export const IS_Dev = process.env.NODE_ENV === 'development';

export const API_BASE_URL = IS_Dev ? '/api' :'/';