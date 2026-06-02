let _env = null

export const setenv = env => (_env = env)
export const getenv = () => _env
