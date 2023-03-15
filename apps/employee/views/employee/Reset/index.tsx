import * as React from "react";
import { FormInput } from "components/forms";
import {
    HStack,
    Text,
    Button,
    Flex,
    Heading,
    Stack,
    Image
  } from '@chakra-ui/react';



const View = () => (
    <Stack minH={'100vh'} direction={{ base: 'column', md: 'row' }}>

      <Stack flex={1} >

        <Image src="/Zayroll Logo.png" alt="wyre logo" w={24} m={12}/>

        <Flex p={12} flex={1} align={'start'} justify={''}
        >
          <Stack
            spacing={4}
            w={'full'}
            maxW={'md'}
          >
            <Stack>
              <Heading color={'primary.100'} fontWeight={'bold'} lineHeight={1.1} fontSize={{ base: '3xl', md: '4xl' }}>
                Reset Password
              </Heading>
                <Text color="primary.100">
                  Enter the OTP we sent to your email address
                </Text> 
              </Stack>
          
          <Stack spacing={4}>            
            <FormInput
              name="otp"
              label="OTP Code"
              placeholder="Enter code"
            />
            <FormInput
              name="password"
              label="New Password"
              placeholder="***************"
            />
            <FormInput
              name="password"
              label="Confirm Password"
              placeholder="***************"
            />
          </Stack>

            <Stack spacing={6}>
              <Button
              color="white"
              bgColor="primary.50" 
              p="3"
                _hover={{
                  bg: 'primary.100',
                }}>
                Reset Password
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Stack>

      <Flex bgColor="primary.main" color="white" flex={1} align={'center'} justify={'center'} >
        <HStack flex={1} align={'start'} justify={'center'} >
          <Stack maxW={'xs'}>
            <Heading>Wyre</Heading>
            <Text>Get paid in mulitiple currencies across the world including cryptocurrency.</Text>
          </Stack>
          <Stack position={'relative'}>
            <Image
              alt={'Image'}
              src={'/Zayroll employee.png'}
              zIndex="1000"
            />
            <Image
              alt={'Image'}
              src={'/Ellipse.png'}
              position="absolute"
              bottom={'-20%'}
              left="-40%"
            />
          </Stack>
        </HStack>
      </Flex>
    </Stack>
);

export default View;