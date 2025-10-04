"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  BloodGroup,
  City,
  Country,
  Department,
  Gender,
  HealthCondition,
  MartialStatus,
  PatientType,
  ReferredBy,
  State,
  Type,
} from "../../core/json/selectOption";
import { useEffect, useState } from "react";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common-components/image-with-base-path";
import CommonSelect from "@/core/common-components/common-select/commonSelect";
import CommonDatePicker from "@/core/common-components/common-date-picker/commonDatePicker";
import CommonFooter from "@/core/common-components/common-footer/commonFooter";
import BranchSelect from "@/core/common-components/common-select/BranchSelect";
import { apiClient } from "@/lib/services/api-client";
import { Patient } from "@/types/emr";
import dayjs, { Dayjs } from "dayjs";

const stepKeys = [
  "v-pills-info",
  "v-pills-medical-history",
  "v-pills-complaints",
];

const EditPatientComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [patient, setPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState({
    patientId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    bloodGroup: "",
    age: "",
    dateOfBirth: "",
    patientType: "",
    gender: "",
    companyName: "",
    maritalStatus: "",
    referredBy: "",
    referredOn: "",
    department: "",
    phoneNumber: "",
    emergencyNumber: "",
    guardianName: "",
    address: "",
    address2: "",
    country: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
    chiefComplaint: "",
    allergies: [] as string[],
    chronicConditions: [] as string[],
    branchId: "",
  });

  const goToStep = (idx: number) => setCurrentStep(idx);
  const goNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, stepKeys.length - 1));
  const goBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    } else {
      setLoading(false);
    }

    document.body.classList.remove('modal-open');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
  }, [patientId]);

  const fetchPatientData = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get<{ patient: Patient }>(`/api/patients/${patientId}`, {
        showErrorToast: true,
      });

      const patientData = response.patient;
      setPatient(patientData);
      
      const branchId = typeof patientData.branch === 'object' && patientData.branch?._id 
        ? patientData.branch._id 
        : (typeof patientData.branch === 'string' ? patientData.branch : "");
      
      setFormData({
        patientId: patientData.patientId || "",
        firstName: patientData.firstName || "",
        middleName: patientData.middleName || "",
        lastName: patientData.lastName || "",
        bloodGroup: patientData.bloodGroup || "",
        age: patientData.age ? patientData.age.toString() : "",
        dateOfBirth: patientData.dateOfBirth ? new Date(patientData.dateOfBirth).toISOString() : "",
        patientType: patientData.patientType || "",
        gender: patientData.gender || "",
        companyName: patientData.companyName || "",
        maritalStatus: patientData.maritalStatus || "",
        referredBy: patientData.referredBy || "",
        referredOn: patientData.referredOn ? new Date(patientData.referredOn).toISOString() : "",
        department: patientData.department || "",
        phoneNumber: patientData.phone || patientData.phoneNumber || "",
        emergencyNumber: patientData.emergencyContact?.phoneNumber || patientData.emergencyContact?.phone || "",
        guardianName: patientData.emergencyContact?.name || "",
        address: patientData.address || "",
        address2: patientData.address2 || "",
        country: patientData.country || "",
        city: patientData.city || "",
        state: patientData.state || "",
        pincode: patientData.zipCode || "",
        notes: patientData.notes || "",
        chiefComplaint: patientData.chiefComplaint || "",
        allergies: patientData.allergies || [],
        chronicConditions: patientData.chronicConditions || [],
        branchId: branchId,
      });
    } catch (error) {
      console.error("Failed to fetch patient:", error);
      router.push(all_routes.allPatientsList);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value?.value || value });
  };

  const handleDateChange = (name: string, date: Dayjs | null) => {
    if (date) {
      setFormData({ ...formData, [name]: date.format('YYYY-MM-DD') });
    }
  };

  const handleBranchChange = (branchId: string) => {
    setFormData({ ...formData, branchId });
  };

  const handleSubmit = async () => {
    if (!patientId) return;

    setSubmitting(true);
    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: formData.dateOfBirth,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        maritalStatus: formData.maritalStatus,
        patientType: formData.patientType,
        companyName: formData.companyName,
        referredBy: formData.referredBy,
        referredOn: formData.referredOn,
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        address2: formData.address2,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.pincode,
        branchId: formData.branchId,
        emergencyContact: {
          name: formData.guardianName,
          relationship: "Guardian",
          phoneNumber: formData.emergencyNumber,
        },
        allergies: formData.allergies,
        chronicConditions: formData.chronicConditions,
        notes: formData.notes,
        chiefComplaint: formData.chiefComplaint,
      };

      await apiClient.put(`/api/patients/${patientId}`, updateData, {
        successMessage: "Patient updated successfully",
      });

      router.push(all_routes.allPatientsList);
    } catch (error) {
      console.error("Failed to update patient:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">Patient not found</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
            <div className="breadcrumb-arrow">
              <h4 className="mb-1">Patients</h4>
              <div className="text-end">
                <ol className="breadcrumb m-0 py-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Edit Patient</li>
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

          <div className="row vertical-tab">
            <div className="col-xl-3 col-lg-4">
              <div className="nav flex-column nav-pills vertical-tab mb-lg-0 mb-4" id="v-pills-tab">
                <button
                  className={`nav-link fw-medium d-flex align-items-center rounded${
                    currentStep === 0
                      ? " active"
                      : currentStep > 0
                      ? " activated"
                      : ""
                  }`}
                  id="v-pills-info-tab"
                  onClick={() => goToStep(0)}
                  type="button"
                >
                  <span />
                  <i className="ti ti-info-circle fs-16" />
                  Basic Information
                </button>
                <button
                  className={`nav-link fw-medium d-flex align-items-center rounded${
                    currentStep === 1
                      ? " active"
                      : currentStep > 1
                      ? " activated"
                      : ""
                  }`}
                  id="v-pills-medical-history-tab"
                  onClick={() => goToStep(1)}
                  type="button"
                >
                  <span />
                  <i className="ti ti-files fs-16" />
                  Medical History
                </button>
                <button
                  className={`nav-link fw-medium d-flex align-items-center rounded${
                    currentStep === 2
                      ? " active"
                      : currentStep > 2
                      ? " activated"
                      : ""
                  }`}
                  id="v-pills-complaints-tab"
                  onClick={() => goToStep(2)}
                  type="button"
                >
                  <span />
                  <i className="ti ti-vaccine fs-16" />
                  Notes
                </button>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8">
              <div
                className="patient-form-wizard flex-fill"
                id="v-pills-tabContent"
              >
                {/* Basic Information */}
                <div
                  className={`form-wizard-content${
                    currentStep === 0 ? " active" : " d-none"
                  }`}
                  id="v-pills-info"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Basic Information</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Patient ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={formData.patientId}
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              First Name<span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Middle Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="middleName"
                              value={formData.middleName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Last Name<span className="text-danger ms-1">*</span>
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Blood Group</label>
                            <CommonSelect
                              options={BloodGroup}
                              className="select"
                              value={BloodGroup.find(bg => bg.value === formData.bloodGroup)}
                              onChange={(val: any) => handleSelectChange("bloodGroup", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">DOB</label>
                            <CommonDatePicker
                              placeholder="dd/mm/yyyy"
                              value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                              onChange={(date) => handleDateChange("dateOfBirth", date)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <CommonSelect
                              options={Gender}
                              className="select"
                              value={Gender.find(g => g.value === formData.gender)}
                              onChange={(val: any) => handleSelectChange("gender", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Marital Status</label>
                            <CommonSelect
                              options={MartialStatus}
                              className="select"
                              value={MartialStatus.find(m => m.value === formData.maritalStatus)}
                              onChange={(val: any) => handleSelectChange("maritalStatus", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">
                              Branch<span className="text-danger ms-1">*</span>
                            </label>
                            <BranchSelect
                              value={formData.branchId}
                              onChange={handleBranchChange}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Contact Information</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Mobile Number</label>
                            <input
                              className="form-control"
                              name="phoneNumber"
                              type="tel"
                              value={formData.phoneNumber}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Emergency Number</label>
                            <input
                              className="form-control"
                              name="emergencyNumber"
                              type="text"
                              value={formData.emergencyNumber}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Guardian / Person Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="guardianName"
                              value={formData.guardianName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Address Line 2</label>
                            <input
                              type="text"
                              className="form-control"
                              name="address2"
                              value={formData.address2}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Country</label>
                            <CommonSelect
                              options={Country}
                              className="select"
                              value={Country.find(c => c.value === formData.country)}
                              onChange={(val: any) => handleSelectChange("country", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-4 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">City</label>
                            <CommonSelect
                              options={City}
                              className="select"
                              value={City.find(c => c.value === formData.city)}
                              onChange={(val: any) => handleSelectChange("city", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">State</label>
                            <CommonSelect
                              options={State}
                              className="select"
                              value={State.find(s => s.value === formData.state)}
                              onChange={(val: any) => handleSelectChange("state", val)}
                            />
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Pincode</label>
                            <input
                              type="text"
                              className="form-control"
                              name="pincode"
                              value={formData.pincode}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end flex-wrap align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goNext}
                    >
                      Next: Medical History
                    </button>
                  </div>
                </div>

                {/* Medical History */}
                <div
                  className={`form-wizard-content${
                    currentStep === 1 ? " active" : " d-none"
                  }`}
                  id="v-pills-medical-history"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Medical History</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Allergies (comma separated)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Penicillin, Peanuts"
                              value={formData.allergies.join(', ')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  allergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label">Chronic Conditions (comma separated)</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Diabetes, Hypertension"
                              value={formData.chronicConditions.join(', ')}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  chronicConditions: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between flex-wrap align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={goBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={goNext}
                    >
                      Next: Notes
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div
                  className={`form-wizard-content${
                    currentStep === 2 ? " active" : " d-none"
                  }`}
                  id="v-pills-complaints"
                >
                  <div className="card">
                    <div className="card-header">
                      <h5 className="mb-0">Additional Notes</h5>
                    </div>
                    <div className="card-body pb-1">
                      <div className="row">
                        <div className="col-md-12">
                          <div className="mb-3">
                            <label className="form-label">Notes</label>
                            <textarea
                              rows={4}
                              className="form-control"
                              name="notes"
                              value={formData.notes}
                              onChange={handleInputChange}
                              placeholder="Enter any additional notes..."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between flex-wrap align-items-center gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={goBack}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        'Update Patient'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    </>
  );
};

export default EditPatientComponent;
