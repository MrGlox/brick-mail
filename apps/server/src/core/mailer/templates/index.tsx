import React from 'react';

import ConfirmEmail from './confirm-email';
import ForgotPassword from './forgot-password';
import InvitationEmail from './invitation-email';
import NewsletterConfirm from './newsletter-confirm';
import PasswordChanged from './password-changed';

export type TemplateType =
  | 'confirm-email'
  | 'forgot-password'
  | 'newsletter-confirm'
  | 'invitation-email'
  | 'password-changed';

export const Templates: {
  [key in TemplateType]: (...args: any[]) => React.JSX.Element;
} = {
  'confirm-email': (props) => <ConfirmEmail {...props} />,
  'forgot-password': (props) => <ForgotPassword {...props} />,
  'newsletter-confirm': (props) => <NewsletterConfirm {...props} />,
  'invitation-email': (props) => <InvitationEmail {...props} />,
  'password-changed': (props) => <PasswordChanged {...props} />,
};
