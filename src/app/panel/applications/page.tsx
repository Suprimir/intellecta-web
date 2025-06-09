"use client";

import { useState, useEffect } from "react";
import { InstructorApplications } from "@/types/api";
import { useAuth } from "@/libs/context/AuthContext";
import React from "react";
import Table from "@/components/Table";
import ApplicationModal from "@/components/modals/ApplicationModal";

export default function PanelCoursesPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<InstructorApplications[]>(
    []
  );
  const [applicationModal, setApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<
    InstructorApplications | undefined
  >(undefined);
  const { user, loadingUser } = useAuth();

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

      const res = await fetch(`/api/applications/`);
      const applications: InstructorApplications[] = await res.json();
      setApplications(applications);
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
          Gestión de Aplicaciones
        </h1>
        <p className="text-gray-600">
          Administra las aplicaciones de instructores que desean unirse a la
          plataforma. Aquí puedes revisar las solicitudes, aprobar o rechazar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-full">
          <Table
            items={applications}
            watchable
            itemsPerPage={8}
            excludedKeys={[
              "qualifications",
              "professional_Experience",
              "user_ID",
            ]}
            onWatch={(application) => {
              setSelectedApplication(application);
              setApplicationModal(true);
            }}
          />
        </div>
      </div>

      <ApplicationModal
        application={selectedApplication}
        closeModal={() => setApplicationModal(false)}
        visible={applicationModal}
        refreshData={loadInitialData}
      />
    </div>
  );
}
