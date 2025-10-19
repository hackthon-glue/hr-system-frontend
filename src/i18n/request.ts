import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async () => {
  // For now, we only support English
  const locale = 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});
