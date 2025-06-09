"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckBadgeIcon,
  XCircleIcon,
  FolderPlusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { User } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import { useRouter } from "next/navigation";
import React from "react";
import UserModal from "@/components/modals/UserModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Table from "@/components/Table";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [userModal, setUserModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [itemsPerPage] = useState(7);
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  // Calcular datos de paginación
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

  const loadInitialData = async () => {
    try {
      const res = await fetch("/api/users");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al inciar los datos:", err);
    } finally {
      const waitForAuth = () =>
        new Promise<void>((resolve) => {
          const interval = setInterval(() => {
            if (!loadingUser) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });

      await waitForAuth();
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadingUser]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/users/byUUID/${selectedUser.uuid}/delete`, {
        method: "POST",
      });

      if (res.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.uuid !== selectedUser.uuid)
        );
        setConfirmationModal(false);
        setSelectedUser(null);
      } else {
        console.error("Error al eliminar el curso");
      }
    } catch (err) {
      console.error("Error al eliminar el curso:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Gestión de Usuarios
        </h1>
        <p className="text-gray-600">
          Administra y edita todos tus usuarios desde aquí
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <button
            onClick={() => {
              setEditMode("create");
              setSelectedUser(null);
              setUserModal(true);
            }}
            className="cursor-pointer text-white flex gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 transition transform hover:-translate-y-0.5 p-2 rounded-xl font-extrabold"
          >
            <FolderPlusIcon className="size-6" />
            Agregar usuario
          </button>
        </div>

        <div className="col-span-full">
          <Table
            items={users}
            editable
            excludedKeys={[
              "uuid",
              "password",
              "profilePicture",
              "bio",
              "last_login",
              "active",
            ]}
            onEdit={(user: User) => {
              setSelectedUser(user);
              setEditMode("edit");
              setUserModal(true);
            }}
            onDelete={(user: User) => {
              setSelectedUser(user);
              setConfirmationModal(true);
            }}
          />
        </div>
      </div>
      <UserModal
        visible={userModal}
        user={selectedUser}
        mode={editMode}
        closeModal={() => setUserModal(false)}
        refreshTable={() => loadInitialData()}
      />
      {confirmationModal && selectedUser && (
        <ConfirmationModal
          visible={confirmationModal}
          onClose={() => setConfirmationModal(false)}
          onConfirm={handleDeleteUser}
          name={selectedUser?.username}
        />
      )}
    </div>
  );
}
