import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { Employee } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import React, { useEffect, useMemo, useState } from "react";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import type z from "zod";

import { FormInput, FormNativeSelect, useForm } from "../../../components";
import RowSelectTable from "../../../components/CustomTable/RowSelectTable";
import ViewLayout from "../../../components/core/ViewLayout";
import FormDateInput from "../../../components/forms/components/FormDateInput";
import { trpc } from "../../../utils/trpc";
import { EmptyEmployeeImage } from "../../../views/Employees/ProviderIcons";
import SuccessModal from "../modals/SuccessModal";
import { createContractorPayrollPath } from "../routes";
import { createPayrollValidationSchema } from "../utils/misc";
import { createPayrollColumns } from "../utils/tableColumns";

type FormInputOptions = z.infer<typeof createPayrollValidationSchema>;
const CreateContractorPayroll = () => {
  const { pathname } = useRouter();
  const [tableData, setTableData] = useState<Employee[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All departments");

  const { data: contractorData, isLoading } = trpc.employee.getContractors.useQuery();

  const handleSelectionChange = (selection: any) => {
    setSelectedRowIds(selection);
  };

  const handleSelectedRowsAmountChange = (amount: number) => {
    setTotalAmount(amount);
  };

  const selectedRows = useMemo(
    () =>
      tableData.filter((row: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return selectedRowIds[row.id];
      }),
    [selectedRowIds, tableData]
  );

  useEffect(() => {
    if (!contractorData) {
      return;
    }

    setTableData(contractorData as Employee[]);
  }, [contractorData]);

  // For table search and filter
  useEffect(() => {
    if (!contractorData) {
      return;
    }

    let filteredData = contractorData;
    if (selectedDepartment !== "All departments") {
      filteredData = contractorData?.filter(
        (data) => data?.department?.toLowerCase() === selectedDepartment?.toLowerCase()
      );
    }
    const searchData = filteredData?.filter((data) =>
      data?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
    setTableData(searchData);
  }, [contractorData, searchTerm, selectedDepartment]);

  // To get the total amount of salaries of selected employees
  useEffect(() => {
    const selectedAmounts = selectedRows.map((row: any) => row.salary);
    const total = selectedAmounts.reduce((sum: number, amount: number) => {
      return sum + amount;
    }, 0);
    handleSelectedRowsAmountChange(total);
  }, [selectedRows]);

  const departmentOptions = useMemo(() => ["All departments", "Tech", "Finance", "Operations"], []);

  const totalEmployeesSelected = selectedEmployees.length;

  const toast = useToast();

  const {
    isOpen: successModalIsOpen,
    onOpen: openSuccessModal,
    onClose: closeSuccessModal,
  } = useDisclosure();

  //   TODO: Change to create contractor payroll when api  is done
  const { mutate: createPayroll, isLoading: submitting } = trpc.payroll.createPayroll.useMutation({
    onSuccess(data: any) {
      // Reset the form data to empty values

      openSuccessModal();
    },
    onError(error: any) {
      toast({
        status: "error",
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: "top-right",
      });
    },
  });

  const handleSubmit = async (data: FormInputOptions) => {
    createPayroll({
      title: data.title,
      cycle: data.cycle,
      auto: data.auto,
      payday: data.payday,
      currency: data.currency,
      burden: totalAmount,
      employees: selectedEmployees,
      suspend: data.suspend,
    });
  };

  const { renderForm } = useForm<FormInputOptions>({
    onSubmit: handleSubmit,
    schema: createPayrollValidationSchema,
    defaultValues: {
      title: "",
      cycle: "daily",
      auto: false,
      payday: undefined,
      currency: "GHC",
      suspend: false,
    },
  });

  return (
    <>
      <ViewLayout title="Payroll">
        <Breadcrumb
          fontSize="sm"
          separator={<FiChevronRight color="#d2d2d2" fontSize="16px" />}
          pb="2"
          fontWeight="semibold"
          color="lightgrey">
          <BreadcrumbItem>
            <BreadcrumbLink href="/payroll">Payroll</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink
              href={createContractorPayrollPath}
              color={pathname === createContractorPayrollPath ? "black" : "lightgrey"}
              isCurrentPage={true}>
              Create Contract Payroll
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        {renderForm(
          <Grid templateColumns="69% 30%" gap={4} mt={4}>
            <GridItem border="1px solid #D2D2D2" rounded="xl" bg="white" p={4}>
              <Heading as="h4" size="xs" fontSize="xl" mb={4}>
                Payroll Details
              </Heading>
              <Stack spacing="6" pb="4">
                <Stack>
                  <FormInput name="title" label="Payroll Title" placeholder="Title" />
                  <HStack>
                    <FormNativeSelect
                      name="cycle"
                      label="Payment Cycle"
                      placeholder="Payment Cycle"
                      options={[
                        { label: "Daily", value: "daily" },
                        { label: "Bi-Weekly", value: "bi-weekly" },
                        { label: "Monthly", value: "monthly" },
                      ]}
                    />

                    <FormDateInput name="payday" label="Payment Date" />
                  </HStack>
                </Stack>
                <Checkbox name="auto" colorScheme="purple" size="md">
                  Allow automatic payment of payroll on due date
                </Checkbox>
              </Stack>
              <Stack mt={6}>
                <Heading as="h4" size="xs" fontSize="xl">
                  Add Contractor(s)
                </Heading>

                {isLoading ? (
                  <Center>
                    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
                  </Center>
                ) : (
                  <>
                    {contractorData && contractorData?.length > 0 ? (
                      <>
                        <Grid templateColumns="30% 25%" justifyContent="space-between" my={6}>
                          <GridItem>
                            <HStack gap="1">
                              <FiSearch fontSize="24px" />
                              <Input
                                variant="unstyled"
                                border="0"
                                borderBottom="1px solid"
                                borderRadius={0}
                                h={12}
                                fontSize="sm"
                                placeholder="Search Employee"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </HStack>
                          </GridItem>
                          <GridItem>
                            <Select
                              value={selectedDepartment}
                              onChange={(event) => setSelectedDepartment(event.target.value)}>
                              {departmentOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Select>
                          </GridItem>
                        </Grid>
                        <RowSelectTable
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          columns={createPayrollColumns}
                          data={tableData}
                          onRowSelectionChange={handleSelectionChange}
                          onSelectedRowsAmountChange={handleSelectedRowsAmountChange}
                          selectedEmployees={selectedEmployees}
                          setSelectedEmployees={setSelectedEmployees}
                        />
                      </>
                    ) : (
                      <Center w="100%" p="8" flexDirection="column">
                        <EmptyEmployeeImage />
                        <Text pr="12" pt={2}>
                          You currently have no contractor
                        </Text>
                      </Center>
                    )}
                  </>
                )}
              </Stack>
            </GridItem>
            <GridItem border="1px solid #D2D2D2" rounded="xl" bg="white" p={4} height="fit-content">
              <Heading as="h4" size="xs" fontSize="xl">
                Summary
              </Heading>
              <VStack spacing={1} align="left" bg="brand.700" color="white" rounded="md" p={4}>
                <Text>Payroll Burden</Text>
                <Text fontSize="xl" fontWeight={700}>
                  {`USD ${totalAmount}`}
                </Text>
              </VStack>

              <Flex justify="space-between" my={6}>
                <Heading as="h4" size="xs" fontSize="md">
                  Selected Employee(s)
                </Heading>
                <Text>{totalEmployeesSelected}</Text>
              </Flex>
              <Flex justify="center" mt={6}>
                <Button
                  bg="brand.700"
                  color="white"
                  type="submit"
                  isLoading={submitting}
                  loadingText="Submitting"
                  iconSpacing="3"
                  w="100%"
                  _hover={{ hover: "none" }}
                  isDisabled={totalEmployeesSelected > 0 ? false : true}>
                  Create Payroll
                </Button>
              </Flex>
            </GridItem>
          </Grid>
        )}

        <SuccessModal
          successModalIsOpen={successModalIsOpen}
          closeSuccessModal={closeSuccessModal}
          message="Your payment is being processed right away"
        />
      </ViewLayout>
    </>
  );
};

export default CreateContractorPayroll;
