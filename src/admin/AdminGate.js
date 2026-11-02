import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/ui';

/** Wraps admin screens: sends the user to the login screen if not signed in as admin. */
export function withAdmin(Screen) {
  return function Guarded(props) {
    const { isAdmin, checking } = useAuth();
    useEffect(() => {
      if (!checking && !isAdmin) props.navigation.replace('AdminLogin');
    }, [checking, isAdmin, props.navigation]);
    if (checking || !isAdmin) return <Loading label="Checking access…" />;
    return <Screen {...props} />;
  };
}
