import { useForm, FormProvider as RHFProvider } from 'react-hook-form';
import { InferType, AnySchema, ObjectSchema } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactNode } from 'react';

interface IFormProviderProps<T extends AnySchema = AnySchema> {
  children: ReactNode;
  defaultValues: InferType<T>;
  schema: T;
}

export const FormProvider = ({ defaultValues, children, schema }: IFormProviderProps<ObjectSchema<object>>) => {
  const formMethods = useForm<InferType<typeof schema>>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  return <RHFProvider {...formMethods}>{children}</RHFProvider>;
};
