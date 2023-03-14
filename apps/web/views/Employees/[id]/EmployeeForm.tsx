import { Avatar, Button, HStack, Stack, Text, useToast } from "@chakra-ui/react";
import z from "zod";

import styledToast from "../../../components/core/StyledToast";
import { FormInput, FormNativeSelect, useForm } from "../../../components/forms";
import { trpc } from "../../../utils/trpc";
import { ProfileIcon } from "./ProviderIcons";

type EmployeeFormProps = {
  employee: any | null; // update the type to match the employee object type
};

const addEmployeeValidationSchema = z.object({
  name: z.string().min(1, { message: "Required" }).default(""),
  email: z.string().email().default(""),
  department: z.string().min(1, { message: "Required" }).default(""),
  jobRole: z.string().min(1, { message: "Required" }).default(""),
  // grossSalary: z.string().min(1, { message: "Required" }),
  // signingBonus: z.string().min(1, { message: "Required" }),
  category: z.string().default(""),
});

type FormInputOptions = z.infer<typeof addEmployeeValidationSchema>;

export default function EmployeeForm({ employee }: EmployeeFormProps) {
  const toast = useToast();
  console.log(employee);
  const { name, email, department, jobRole, category, salary, signBonus } = employee ?? {};

  const { mutate: updateEmployee, isLoading } = trpc.employee.updateEmployee.useMutation({
    onSuccess(data: any) {
      // Reset the form data to empty values
      styledToast({
        status: "success",
        description: "Profile has been updated successfully",
        toast: toast,
      });
    },
    onError(error: any) {
      toast({
        status: "error",
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: "top-right",
      });
      console.log(error);
    },
  });

  const handleSubmit = async (data: FormInputOptions) => {
    try {
      updateEmployee({
        id: employee.id, // pass the ID of the employee that you want to update
        data: {
          name: data.name,
          email: data.email,
          department: data.department,
          jobRole: data.jobRole,
          salary: employee.salary,
          signBonus: employee.signBonus,
          status: true,
          category: data.category as "CONTRACTOR" | "EMPLOYEE", // cast the category to the correct type
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { mutate: terminateEmployee, isLoading: isTerminating } = trpc.employee.updateEmployee.useMutation({
    onSuccess(data: any) {
      styledToast({
        status: "success",
        description: "Employee has been terminated successfully",
        toast: toast,
      });
    },
    onError(error: any) {
      toast({
        status: "error",
        description: `${error}`,
        isClosable: true,
        duration: 5000,
        position: "top-right",
      });
      console.log(error);
    },
  });

  const handleTerminate = async () => {
    try {
      terminateEmployee({
        id: employee.id,
        data: {
          name: name,
          email: email,
          department: department,
          jobRole: jobRole,
          salary: salary,
          signBonus: signBonus,
          status: false, // add status field with the value of false
          category: category,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const { renderForm } = useForm<FormInputOptions>({
    onSubmit: handleSubmit,
    defaultValues: {
      name: name,
      email: email,
      department: department,
      jobRole: jobRole,
      category: category,
      // grossSalary: "",
      // signingBonus: ""
    },
    schema: addEmployeeValidationSchema,
  });

  return renderForm(
    <Stack spacing="6" pb="4" mt="-0.5rem">
      <Text fontWeight="bold" fontSize="18px">
        Personal Details
      </Text>

      <Stack spacing={3}>
        <Avatar size="xl" src="" name={name} />
        <HStack>
          <FormInput name="name" label="First Name" placeholder="First Name" defaultValue={name} />
          <FormInput name="lastName" label="Last Name" placeholder="Last Name" />
        </HStack>
        <HStack>
          <FormInput name="email" label="Email Address" placeholder="Email Address" defaultValue={email} />
          <FormInput name="phoneNumber" label="Phone Number" placeholder="Phone Number" />
        </HStack>
        <HStack>
          <FormInput name="city" label="City" placeholder="City" />
          <FormInput name="country" label="Country" placeholder="Country" />
        </HStack>
      </Stack>
      <Stack spacing={3}>
        <Text fontWeight="bold" fontSize="18px">
          Contract Details
        </Text>
        <HStack>
          <FormNativeSelect
            name="category"
            label="Category"
            placeholder="Select Category"
            options={[
              { label: "Contractor", value: "CONTRACTOR" },
              { label: "Employee", value: "EMPLOYEE" },
            ]}
            defaultValue="EMPLOYEE" // set default value to "Employee"
          />
          <FormInput name="payrollMethod" label="Payroll Method" placeholder="Payroll Method" />
        </HStack>
        <HStack>
          <FormInput
            name="department"
            label="Department"
            placeholder="Enter Department"
            defaultValue={department}
          />
          <FormInput name="jobRole" label="Job Role" placeholder="Job Role" defaultValue={jobRole} />
        </HStack>
      </Stack>

      <HStack spacing="4" pt="4">
        <Button
          variant="darkBtn"
          rightIcon={<ProfileIcon fill="#fff" stroke="#fff" />}
          iconSpacing="3"
          w="fit-content"
          type="submit"
          isLoading={isLoading}
          _hover={{ bg: "" }}
          loadingText="Updating">
          Update Profile
        </Button>
        <Button
          onClick={handleTerminate}
          isLoading={isTerminating}
          loadingText="Terminating"
          variant="greyBtn"
          rightIcon={<ProfileIcon fill="#210D35" stroke="#210D35" />}
          iconSpacing="3"
          w="fit-content"
          _hover={{ bg: "" }}>
          Terminate Employee
        </Button>
      </HStack>
    </Stack>
  );
}
