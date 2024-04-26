import { BOARD_CONFIG_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { IBoardConfigData } from '@src/containers/ConfigStep/Form/schema';
import { TBoardFieldKeys } from '@src/containers/ConfigStep/Form/type';
import { StyledTextField } from '@src/components/Common/ConfigForms';
import { updateBoard } from '@src/context/config/configSlice';
import { Controller, useFormContext } from 'react-hook-form';
import { useAppDispatch } from '@src/hooks/useAppDispatch';
import { KEYS } from '@src/hooks/useVerifyBoardEffect';
interface IFormTextField {
  name: Exclude<TBoardFieldKeys, 'type'>;
  col: number;
  label: string;
}

export const FormTextField = ({ name, col, label }: IFormTextField) => {
  const dispatch = useAppDispatch();
  const {
    control,
    setError,
    reset,
    formState: { isSubmitSuccessful },
    getValues,
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <StyledTextField
            {...field}
            data-testid={name}
            required
            label={label}
            variant='standard'
            type={name === KEYS.TOKEN ? 'password' : 'text'}
            onFocus={() => {
              if (field.value === '') {
                setError(name, { message: BOARD_CONFIG_ERROR_MESSAGE[name].required });
              }
            }}
            onChange={(e) => {
              if (isSubmitSuccessful) {
                reset(undefined, { keepValues: true, keepErrors: true });
              }
              const values = getValues() as IBoardConfigData;
              const boardConfig: IBoardConfigData = {
                ...values,
                [name]: e.target.value,
              };
              dispatch(updateBoard(boardConfig));
              field.onChange(e.target.value);
            }}
            error={fieldState.invalid && fieldState.error?.message !== BOARD_CONFIG_ERROR_MESSAGE.token.timeout}
            helperText={
              fieldState.error?.message && fieldState.error?.message !== BOARD_CONFIG_ERROR_MESSAGE.token.timeout
                ? fieldState.error?.message
                : ''
            }
            sx={{ gridColumn: `span ${col}` }}
          />
        );
      }}
    />
  );
};
