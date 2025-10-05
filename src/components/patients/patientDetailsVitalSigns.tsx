"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PatientDetailsHeader from "./PatientDetailsHeader";
import { all_routes } from "@/router/all_routes";
import CommonFooter from "@/core/common-components/common-footer/commonFooter";
import { toast } from "react-toastify";
import { format } from "date-fns";

const PatientDetailsVitalSignsComponent = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");

  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const fetchVitalSigns = async () => {
    if (!patientId) {
      toast.error("Patient ID not found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/visits?patient=${patientId}&limit=100`);

      if (!response.ok) {
        throw new Error("Failed to fetch vital signs");
      }

      const data = await response.json();
      const visitsWithVitalSigns = (data.visits || []).filter(
        (visit: any) => visit.stages?.nurse?.vitalSigns
      );
      setVisits(visitsWithVitalSigns);
    } catch (error: any) {
      console.error("Error fetching vital signs:", error);
      toast.error(error.message || "Failed to fetch vital signs");
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVitalSigns();
  }, [patientId, sortOrder]);

  const formatDate = (date: string | Date) => {
    try {
      return format(new Date(date), "dd MMM yyyy, hh:mm a");
    } catch {
      return "N/A";
    }
  };

  const calculateBMI = (weight?: number, height?: number) => {
    if (!weight || !height || height === 0) return "N/A";
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div className="breadcrumb-arrow">
              <h4 className="mb-1">Patient Details</h4>
              <div className="text-end">
                <ol className="breadcrumb m-0 py-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Patient Details</li>
                </ol>
              </div>
            </div>
            <Link
              href={all_routes.patients}
              className="fw-medium d-flex align-items-center"
            >
              <i className="ti ti-arrow-left me-1" />
              Back to Patient
            </Link>
          </div>

          <PatientDetailsHeader />

          <div className="card mb-0">
            <div className="card-header d-flex align-items-center flex-wrap gap-2 justify-content-between">
              <h5 className="d-inline-flex align-items-center mb-0">
                Vital Signs
                <span className="badge bg-danger ms-2">{visits.length}</span>
              </h5>
              <div className="d-flex align-items-center flex-wrap">
                <div className="dropdown">
                  <Link
                    href="#"
                    className="dropdown-toggle btn btn-md btn-outline-light d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                    aria-label="Patient actions menu"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="ti ti-sort-descending-2 me-1" />
                    <span className="me-1">Sort By : </span>{" "}
                    {sortOrder === "newest" ? "Newest" : "Oldest"}
                  </Link>
                  <ul className="dropdown-menu dropdown-menu-end p-2">
                    <li>
                      <Link
                        href="#"
                        className="dropdown-item rounded-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setSortOrder("newest");
                        }}
                      >
                        Newest
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#"
                        className="dropdown-item rounded-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setSortOrder("oldest");
                        }}
                      >
                        Oldest
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading vital signs...</p>
                </div>
              ) : visits.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3">
                    <i
                      className="ti ti-heart-rate-monitor"
                      style={{ fontSize: "48px", color: "#6c757d" }}
                    />
                  </div>
                  <h5 className="text-muted">No Vital Signs Found</h5>
                  <p className="text-muted mb-0">
                    No vital signs have been recorded for this patient yet.
                  </p>
                </div>
              ) : (
                <div className="table-responsive table-nowrap">
                  <table className="table mb-0 border">
                    <thead className="table-light">
                      <tr>
                        <th>Date</th>
                        <th>Blood Pressure</th>
                        <th>Temperature (°C)</th>
                        <th>Pulse (bpm)</th>
                        <th>Weight (kg)</th>
                        <th>Height (cm)</th>
                        <th>BMI</th>
                        <th>Recorded By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visits.map((visit) => {
                        const vitalSigns = visit.stages?.nurse?.vitalSigns || {};
                        const bmi = calculateBMI(vitalSigns.weight, vitalSigns.height);
                        
                        return (
                          <tr key={visit._id}>
                            <td>{formatDate(visit.visitDate)}</td>
                            <td>{vitalSigns.bloodPressure || "N/A"}</td>
                            <td>
                              {vitalSigns.temperature
                                ? `${vitalSigns.temperature}°C`
                                : "N/A"}
                            </td>
                            <td>{vitalSigns.pulse || "N/A"}</td>
                            <td>
                              {vitalSigns.weight ? `${vitalSigns.weight} kg` : "N/A"}
                            </td>
                            <td>
                              {vitalSigns.height ? `${vitalSigns.height} cm` : "N/A"}
                            </td>
                            <td>{bmi}</td>
                            <td>
                              {visit.stages?.nurse?.recordedBy?.firstName &&
                              visit.stages?.nurse?.recordedBy?.lastName
                                ? `${visit.stages.nurse.recordedBy.firstName} ${visit.stages.nurse.recordedBy.lastName}`
                                : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <CommonFooter />
    </>
  );
};

export default PatientDetailsVitalSignsComponent;
