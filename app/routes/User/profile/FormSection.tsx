import { useLoaderData, useRevalidator } from "react-router";
import type { clientLoader } from "./page";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useState, type FormEvent } from "react";
import { Button } from "~/components/ui/button";
import { CalendarIcon, Edit } from "lucide-react";
import api from "~/lib/axios";
import type { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import type { Payload } from "~/types/payload";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { format } from "date-fns";

export type CreateUser = {
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  bio: string;
  dateOfBirth: string;
};

const FormSection = () => {
  const { revalidate } = useRevalidator();
  const { user } = useLoaderData<typeof clientLoader>();
  const [formData, setFormData] = useState<CreateUser>({
    name: user.name,
    phoneNumber: user.phoneNumber,
    email: user.email,
    address: user.address,
    bio: user.bio,
    dateOfBirth: user.dateOfBirth,
  });
  const [isEdit, setIsEdit] = useState(false);
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return;
    const payload = jwtDecode<Payload>(token);
    const date = new Date(formData.dateOfBirth);
    const formatted = date.toISOString().split("T")[0];
    const newForm: CreateUser = {
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      bio: formData.bio,
      dateOfBirth: formatted,
    };
    try {
      await api.put(`/users/${payload.userId}`, newForm);
      revalidate();
      setIsEdit(false);
    } catch (e) {
      const err = e as AxiosError<{ message: string }>;
      console.error("error", err.response);
    }
  };
  return (
    <form
      onSubmit={handleUpdate}
      className="relative w-full space-y-10 col-span-10 p-10 border rounded-xl"
    >
      {!isEdit && (
        <Tooltip>
          <TooltipTrigger asChild className="absolute right-4 top-8">
            <Button onClick={() => setIsEdit(true)}>
              <Edit />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Profile</p>
          </TooltipContent>
        </Tooltip>
      )}
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Name</Label>
        {isEdit ? (
          <Input
            className="col-span-6"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            defaultValue={user.name}
          />
        ) : (
          <Label className="col-span-6">{user.name}</Label>
        )}
      </div>
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Email</Label>
        {isEdit ? (
          <Input className="col-span-6" defaultValue={user.email} />
        ) : (
          <Label className="col-span-6">{user.email}</Label>
        )}
      </div>
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Phone Number</Label>
        {isEdit ? (
          <Input
            className="col-span-6"
            defaultValue={user.phoneNumber}
            onChange={({ target }) =>
              setFormData({ ...formData, phoneNumber: target.value })
            }
          />
        ) : (
          <Label className="col-span-6">{user.phoneNumber}</Label>
        )}
      </div>
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Date of Birth</Label>
        {isEdit ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !formData.dateOfBirth && "text-muted-foreground",
                )}
              >
                {formData.dateOfBirth ? (
                  format(formData.dateOfBirth, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(formData.dateOfBirth)}
                onSelect={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: (e as Date).toString(),
                  })
                }
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>
        ) : (
          <Label className="col-span-6">{user.dateOfBirth}</Label>
        )}
      </div>
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Address</Label>
        {isEdit ? (
          <Textarea
            className="col-span-6"
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            defaultValue={user.address}
          />
        ) : (
          <Label className="col-span-6">{user.address}</Label>
        )}
      </div>
      <div className="grid grid-cols-12">
        <Label className="col-span-6">Bio</Label>
        {isEdit ? (
          <Textarea
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="col-span-6"
            defaultValue={user.bio}
          />
        ) : (
          <Label className="col-span-6">{user.bio}</Label>
        )}
      </div>
      {isEdit && (
        <div className="flex justify-end gap-2">
          <Button type="submit" onClick={handleUpdate}>
            Save
          </Button>
          <Button variant={"outline"} onClick={() => setIsEdit(false)}>
            Cancle
          </Button>
        </div>
      )}
    </form>
  );
};

export default FormSection;
