import router from 'next/router';
import { useEffect, useState } from 'react';
import { api } from '~/utils/api';

import Sidebar from '@/components/Staff/Sidebar';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type EmployeePersonalProps = {
  query: { id: string };
};

EmployeePersonalPage.getInitialProps = ({ query }: EmployeePersonalProps) => {
  return { query };
};

export default function EmployeePersonalPage({ query }: EmployeePersonalProps) {
  const { data: employee, failureReason } = api.employee?.findOne.useQuery({
    id: query.id,
  });

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const updateEmpoyee = api.employee.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Employee updated.",
        description: "The employee's information has been updated.",
      });
      setEdit(false);
      queryClient.invalidateQueries();
    },

    onError: () => {
      toast({
        title: "An error occurred.",
        description: "The employee's information could not be updated.",
      });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    updateEmpoyee.mutate({
      email,
      address,
      phoneNumber: phone,
      employeeId: employee?.id!,
      name: firstName + " " + lastName,
    });
  }

  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    if (employee) {
      setEmail(employee.email!);
      setAddress(employee.address!);
      setPhone(employee.phoneNumber!);
      setLastName(employee.name?.split(" ")[1]!);
      setFirstName(employee.name?.split(" ")[0]!);
    }
  }, [employee]);

  const [edit, setEdit] = useState<boolean>(false);

  if (failureReason?.data?.httpStatus === 401) {
    router.push("/");
  }

  if (!employee || !employee.name) {
    return <Sidebar />;
  }

  return (
    <main className="flex">
      <Sidebar employee={employee} />
      <div className="mt-4 flex flex-col">
        <Heading size={"sm"}>
          {employee.name.endsWith("s")
            ? `${employee.name}'`
            : `${employee.name}'s`}{" "}
          Personal Information
        </Heading>{" "}
        <Table className="mt-4 border text-lg">
          <TableHeader className="border">
            <TableHead className="border-r">Name</TableHead>
            <TableHead className="border-r">Phone</TableHead>
            <TableHead className="border-r">Email</TableHead>
            <TableHead className="text-right">Address</TableHead>
          </TableHeader>
          <TableBody>
            <TableCell className="border-r">{employee.name}</TableCell>
            <TableCell className="border-r">{employee.phoneNumber}</TableCell>
            <TableCell className="border-r">{employee.email}</TableCell>
            <TableCell className="text-right">{employee.address}</TableCell>
          </TableBody>
        </Table>
        <Button className="mt-2 w-fit" onClick={() => setEdit(true)}>
          Edit Info
        </Button>
      </div>

      {edit && (
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Employee Information</AlertDialogTitle>
              <AlertDialogDescription>
                Edit the employee's information below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="johndoe@example.com"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="555-555-5555"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="1234 Main St"
                    required
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel type="button" onClick={() => setEdit(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </main>
  );
}
