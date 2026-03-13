import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const LocalizedLink = ({ to, ...props }: any) => {
  const { pathname } = useLocation();
  const lang = pathname.split('/')[1] || 'en';
  const localizedTo = to.startsWith('/') ? `/${lang}${to}` : `/${lang}/${to}`;
  return <Link to={localizedTo} {...props} />;
};
