import OpenAPI from '@wesleytodd/openapi';

export const openAPI = OpenAPI({
  openapi: '3.0.0',
  info: {
    title: 'AI Assistant Tools',
    description: 'Tools that can be used by AI assistants.',
    version: '0.0.1',
  },
});

export default openAPI;
