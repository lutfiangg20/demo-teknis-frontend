import api from "~/lib/axios";
import type { Route } from "./+types/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Ban, Check, Eye, Trash2 } from "lucide-react";
import CustomTooltip from "~/components/CustomTooltip";
import { useCallback, useEffect, useState } from "react";
import lodash from "lodash";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import type { PaginationResponse } from "~/types/PaginationResponse";
import type { AxiosError } from "axios";
import { Link } from "react-router";

type AllUser = {
  id: number;
  email: string;
  name: string;
};

export const clientLoader = async () => {
  const res = await api.get<PaginationResponse<AllUser>>(
    "/users?page=0&size=10",
  );
  console.log("res", res.data);
  return { users: res.data };
};

const page = ({ loaderData }: Route.ComponentProps) => {
  const { users } = loaderData;
  const [allUsers, setAllUsers] = useState<PaginationResponse<AllUser>>(users);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [isOpenDelete, setIsOpendelete] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const getUsersDebounce = useCallback(
    lodash.debounce(async () => {
      console.log("search", search);
      const res = await api.get<PaginationResponse<AllUser>>(
        `/users?page=${page}&size=${size}&search=${search}`,
      );
      setAllUsers(res.data);
    }, 200),
    [search, page, size, users],
  );

  const getUsers = useCallback(async () => {
    const res = await api.get<PaginationResponse<AllUser>>(
      `/users?page=${page}&size=${size}&search=${search}`,
    );
    setAllUsers(res.data);
  }, [page, size, users]);

  useEffect(() => {
    getUsersDebounce();
  }, [search]);

  useEffect(() => {
    getUsers();
  }, [page, size]);

  const handlOpenDelete = (id: number) => {
    setSelectedId(id);
    setIsOpendelete(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${selectedId}`);
      getUsers();
    } catch (error) {
      const err = error as AxiosError;
      console.error(err.response);
    }

    setSelectedId(0);
    setIsOpendelete(false);
  };

  return (
    <div>
      <Input
        placeholder="Search..."
        className="w-60"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allUsers.data.content.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {allUsers.data.pageable.offset + (index + 1)}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>

              {isOpenDelete && selectedId === user.id ? (
                <TableCell className="flex gap-2">
                  <Button
                    onClick={() => {
                      setIsOpendelete(false);
                      setSelectedId(0);
                    }}
                    variant={"outline"}
                    size={"icon"}
                  >
                    <Ban className="text-red-500" />
                  </Button>
                  <Button
                    onClick={() => handleDelete()}
                    variant={"outline"}
                    size={"icon"}
                  >
                    <Check className="text-primary" />
                  </Button>
                </TableCell>
              ) : (
                <TableCell className="flex gap-2">
                  <CustomTooltip title="Detail">
                    <Link to={`/user/all-users/${user.id}`}>
                      <Button variant={"outline"} size={"icon"}>
                        <Eye className="text-primary" />
                      </Button>
                    </Link>
                  </CustomTooltip>
                  <CustomTooltip title="Delete">
                    <Button
                      onClick={() => handlOpenDelete(user.id)}
                      variant={"outline"}
                      size={"icon"}
                    >
                      <Trash2 className="text-red-500" />
                    </Button>
                  </CustomTooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => {
                page > 0 && setPage(page - 1);
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">{page + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>of</PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              onClick={() => setPage(allUsers.data.totalPages - 1)}
            >
              {allUsers.data.totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => {
                if (page + 1 < allUsers.data.totalPages) {
                  setPage(page + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default page;
