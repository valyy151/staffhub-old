import { getSession } from "next-auth/react";
import { GetServerSideProps } from "next/types";
import { useState } from "react";
import { api } from "~/utils/api";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};

export default function NewEmployeePage() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { toast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      return toast({ title: "Please fill out all the fields." });
    }

    createEmployee.mutate({
      role,
      email,
      name: firstName + " " + lastName,
    });
  }

  const { data: roles } = api.staffRole.find.useQuery();

  const createEmployee = api.employee.create.useMutation({
    onSuccess: () => {
      window.location.href = "/staff";
    },

    onError: () => {
      toast({ title: "There was a problem creating the employee." });
    },
  });

  return (
    <form onSubmit={handleSubmit} className="mb-10 mt-20 flex-grow">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Employee</CardTitle>
          <CardDescription>
            Fill out the form below to create a new employee.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {roles?.length! > 0 && (
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Role</SelectLabel>
                      {roles?.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            Create User
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
