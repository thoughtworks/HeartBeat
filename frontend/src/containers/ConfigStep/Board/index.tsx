import { ConfigSectionContainer, StyledForm } from '@src/components/Common/ConfigForms';
import { BOARD_CONFIG_ERROR_MESSAGE } from '@src/containers/ConfigStep/Form/literal';
import { FIELD_KEY, useVerifyBoardEffect } from '@src/hooks/useVerifyBoardEffect';
import { FormTextField } from '@src/containers/ConfigStep/Board/FormTextField';
import { FormSingleSelect } from '@src/containers/ConfigStep/Form/FormSelect';
import { ConfigButtonGrop } from '@src/containers/ConfigStep/ConfigButton';
import { ConfigSelectionTitle } from '@src/containers/MetricsStep/style';
import { StyledAlterWrapper } from '@src/containers/ConfigStep/style';
import { CONFIG_TITLE, BOARD_TYPES } from '@src/constants/resources';
import { FormAlert } from '@src/containers/ConfigStep/FormAlert';
import { formAlertTypes } from '@src/constants/commons';
import { Loading } from '@src/components/Loading';
import { useFormContext } from 'react-hook-form';

export const Board = () => {
  const { verifyJira, isLoading, fields, resetFields } = useVerifyBoardEffect();
  const {
    clearErrors,
    formState: { isValid, isSubmitSuccessful, errors },
    handleSubmit,
  } = useFormContext();
  const isVerifyTimeOut = errors.token?.message === BOARD_CONFIG_ERROR_MESSAGE.token.timeout;
  const isBoardVerifyFailed =
    errors.email?.message === BOARD_CONFIG_ERROR_MESSAGE.email.verifyFailed ||
    errors.token?.message === BOARD_CONFIG_ERROR_MESSAGE.token.verifyFailed;
  const isVerified = isValid && isSubmitSuccessful;
  const showAlert = isVerifyTimeOut || isBoardVerifyFailed;
  const formAlertType = isVerifyTimeOut ? formAlertTypes.TIMEOUT : formAlertTypes.BOARD_VERIFY;

  const onSubmit = async () => await verifyJira();
  const closeAlert = () => clearErrors([fields[FIELD_KEY.EMAIL].key, fields[FIELD_KEY.TOKEN].key]);

  return (
    <ConfigSectionContainer aria-label='Board Config'>
      {isLoading && <Loading />}
      <ConfigSelectionTitle>{CONFIG_TITLE.BOARD}</ConfigSelectionTitle>
      <StyledAlterWrapper>
        {showAlert && (
          <FormAlert showAlert={showAlert} onClose={closeAlert} moduleType={'Board'} formAlertType={formAlertType} />
        )}
      </StyledAlterWrapper>
      <StyledForm onSubmit={handleSubmit(onSubmit)} onReset={resetFields}>
        {fields.map(({ key, col, label }) =>
          key === 'type' ? (
            <FormSingleSelect
              key={key}
              name={key}
              options={Object.values(BOARD_TYPES)}
              labelText='Board'
              labelId='board-type-checkbox-label'
              selectLabelId='board-type-checkbox-label'
            />
          ) : (
            <FormTextField name={key} key={key} col={col} label={label} />
          ),
        )}
        <ConfigButtonGrop
          isVerifyTimeOut={isVerifyTimeOut}
          isVerified={isVerified}
          isDisableVerifyButton={!isValid}
          isLoading={isLoading}
        />
      </StyledForm>
    </ConfigSectionContainer>
  );
};
