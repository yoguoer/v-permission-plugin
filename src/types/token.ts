export interface TokenKeyOptions {
    token_key?: string,
  
    oa_token_keys?: string[],
      
    locale_key?: string,
      
    // user info key  
    user_info_key?: string,
      
    // user authority key  
    user_authority_key?: string,
      
    // user async route key  
    user_async_route_key?: string
}

export interface StorageOptions {
    type: 'localStorage' | 'sessionStorage' | 'cookie',
    expires?: number | undefined
}