import { useRouter } from 'next/router';
import React from 'react';
import { trpc } from '../utils/trpc';

export default function Page() {
  const router = useRouter();
  const { id, token } = router.query;
  const mutation = trpc.auth.verifyAdminEmail.useMutation();

  React.useEffect(() => {
    mutation.mutate({
      id: id as string,
      token: token as string,
    });
    router.push('/login');
  });
  return <div>loading...</div>;
}
