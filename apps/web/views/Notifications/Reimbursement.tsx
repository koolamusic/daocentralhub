import { HStack, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import ViewLayout from '../../components/core/ViewLayout';

type Props = {};

const Reimbursement = (props: Props) => {
  return (
    <ViewLayout title="Reimbursement">
      <HStack gap="4" align="center">
        <Stack borderRadius="15px" border="1px solid" borderColor="bordergrey" p="4" bg="white" w="100%">
          <Stack spacing={4} p={5}>
            <Text fontWeight="bold" fontSize="18px">
              Reimbursement
            </Text>
          </Stack>
        </Stack>
      </HStack>
    </ViewLayout>
  );
};

export default Reimbursement;
