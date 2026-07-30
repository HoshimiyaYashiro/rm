import { DEFAULT_LANG } from '@/constants/config';
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  // Đọc locale từ cookie 'NEXT_LOCALE', mặc định là default
  const locale = cookieStore.get('NEXT_LOCALE')?.value || DEFAULT_LANG; 

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});