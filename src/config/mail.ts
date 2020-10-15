interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'ceo@rafaelnerymachado.com.br',
      name: 'Rafael Nery Machado',
    },
  },
} as IMailConfig;
