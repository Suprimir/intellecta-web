"use client";

import { useState, useEffect } from "react";
import { FolderPlusIcon } from "@heroicons/react/24/outline";
import { Course, Ticket } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import React from "react";
import CourseModal from "@/components/modals/CourseModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import Table from "@/components/Table";
import { useRouter } from "next/navigation";
import TicketModal from "@/components/modals/TicketModal";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketModal, setTicketModal] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | undefined>(
    undefined
  );
  const { user, loadingUser } = useAuth();
  const router = useRouter();

  const loadInitialData = async () => {
    try {
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

      const res = await fetch(`/api/support-tickets/`);
      const tickets: Ticket[] = await res.json();
      setTickets(tickets);
    } catch (err) {
      console.error("Error al inciar los datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [loadingUser]);

  return (
    <div className="w-full">
      <div className="mb-8 pt-16 lg:pt-0">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Soporte y Tickets
        </h1>
        <p className="text-gray-600">
          Administra los tickets de soporte y resuelve las consultas de los
          usuarios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-full">
          <Table
            items={tickets}
            watchable
            itemsPerPage={8}
            excludedKeys={["user_R_ID", "resolution", "problem_description"]}
            onWatch={(ticket) => {
              setSelectedTicket(ticket);
              setTicketModal(true);
            }}
          />
        </div>
      </div>
      <TicketModal
        closeModal={() => setTicketModal(false)}
        ticket={selectedTicket}
        visible={ticketModal}
        refreshData={loadInitialData}
      />
    </div>
  );
}
