import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import z from 'zod';
import { useForm } from '../components/forms';
import { Meta } from '../layouts';
import { trpc } from '../utils/trpc';
import View from '../views/Register';

const signUpValidationSchema = z
  .object({
    company: z.string().min(1, 'Company name is required'),
    companyPhone: z.number().min(1, 'Phone number is required'),
    country: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email(),
    role: z.string().min(1, 'Job role is required'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be more than 6 characters')
      .max(32, 'Password must be less than 32 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormInputOptions = z.infer<typeof signUpValidationSchema>;

export default function Page() {
  const router = useRouter();
  const toast = useToast();

  const Submit = (data: FormInputOptions) => {
    signUp({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.company,
      companyPhone: data.companyPhone ? String(data.companyPhone) : undefined,
      country: data.country,
      jobRole: data.role,
    });
  };

  const { renderForm, resetForm } = useForm<FormInputOptions>({
    onSubmit: Submit,
    schema: signUpValidationSchema,
  });

  const { mutate: signUp, isLoading } = trpc.auth.adminSignUp.useMutation({
    onSuccess: (data) => {
      resetForm(); //reset form
      if (data) {
        const { admin } = data;
        const { email, id } = admin;
        toast({
          status: 'success',
          description: `Registration successful. Please check your email ${email} to verify your account.`,
          isClosable: true,
          duration: 5000,
          position: 'top-right',
        });
        router.push({
          pathname: `/verify`,
          query: { id, email },
        });
      }
    },
    onError(error: unknown) {
      toast({
        status: 'error',
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: 'top-right',
      });
    },
  });

  return renderForm(
    <>
      <Meta />
      <View isSubmitting={isLoading} />
    </>
  );
}
