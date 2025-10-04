"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { all_routes } from "@/router/all_routes";
import ImageWithBasePath from "@/core/common-components/image-with-base-path";
import CommonFooter from "@/core/common-components/common-footer/commonFooter";
import BranchSelect from "@/core/common-components/common-select/BranchSelect";
import { apiClient } from "@/lib/services/api-client";
import { Doctor } from "@/types/emr";

const EditDoctorsComponent = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState<"basic" | "extra">("basic");
  const [activatedSteps, setActivatedSteps] = useState<{ basic: boolean; extra: boolean }>({ 
    basic: false, 
    extra: false 
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    specialization: "",
    licenseNumber: "",
    department: "",
    bio: "",
    branchId: "",
  });

  useEffect(() => {
    if (doctorId) {
      fetchDoctorData();
    } else {
      setLoading(false);
    }

    document.body.classList.remove('modal-open');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
  }, [doctorId]);

  const fetchDoctorData = async () => {
    if (!doctorId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get<Doctor>(`/api/doctors/${doctorId}`, {
        showErrorToast: true,
      });

      setDoctor(response);
      const branchId = typeof response.branchId === 'object' && response.branchId?._id 
        ? response.branchId._id 
        : (typeof response.branchId === 'string' ? response.branchId : "");
      
      setFormData({
        firstName: response.firstName || "",
        lastName: response.lastName || "",
        email: response.email || "",
        phoneNumber: response.phoneNumber || "",
        specialization: response.profile?.specialization || "",
        licenseNumber: response.profile?.licenseNumber || "",
        department: response.profile?.department || "",
        bio: response.profile?.bio || "",
        branchId: branchId,
      });
    } catch (error) {
      console.error("Failed to fetch doctor:", error);
      router.push(all_routes.allDoctorsList);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchChange = (branchId: string) => {
    setFormData({ ...formData, branchId });
  };

  const handleNext = () => {
    setActivatedSteps((prev) => ({ ...prev, basic: true }));
    setCurrentStep("extra");
  };

  const handleBack = () => {
    setActivatedSteps((prev) => ({ ...prev, extra: true }));
    setCurrentStep("basic");
  };

  const handleSubmit = async () => {
    if (!doctorId) return;

    setSubmitting(true);
    try {
      await apiClient.put(`/api/doctors/${doctorId}`, formData, {
        successMessage: "Doctor updated successfully",
      });
      router.push(all_routes.allDoctorsList);
    } catch (error) {
      console.error("Failed to update doctor:", error);
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

  if (!doctor) {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="alert alert-danger">Doctor not found</div>
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
              <h4 className="mb-1">Edit Doctor</h4>
              <div className="text-end">
                <ol className="breadcrumb m-0 py-0">
                  <li className="breadcrumb-item">
                    <Link href={all_routes.dashboard}>Home</Link>
                  </li>
                  <li className="breadcrumb-item active">Edit Doctor</li>
                </ol>
              </div>
            </div>
            <div className="gap-2 d-flex align-items-center flex-wrap">
              <Link
                href={all_routes.allDoctorsList}
                className="fw-medium d-flex align-items-center"
              >
                <i className="ti ti-arrow-left me-1" />
                Back to Doctors
              </Link>
            </div>
          </div>

          <div className="row patient-add vertical-tab">
            <div className="col-xl-3 col-lg-4">
              <div className="nav flex-column nav-pills" id="v-pills-tab">
                <button
                  className={`nav-link fw-medium d-flex align-items-center rounded ${
                    currentStep === "basic" ? "active" : activatedSteps.basic ? "activated" : ""
                  }`}
                  id="v-pills-info-tab"
                  type="button"
                  onClick={() => setCurrentStep("basic")}
                >
                  <span />
                  <i className="ti ti-info-circle fs-16" />
                  Basic Information
                </button>
                <button
                  className={`nav-link fw-medium d-flex align-items-center rounded ${
                    currentStep === "extra" ? "active" : activatedSteps.extra ? "activated" : ""
                  }`}
                  id="v-pills-vituals-tab"
                  type="button"
                  onClick={() => setCurrentStep("extra")}
                >
                  <span />
                  <i className="ti ti-vector-spline fs-16" />
                  Extra Information
                </button>
              </div>
            </div>

            <div className="col-xl-9 col-lg-8">
              <div className="patient-form-wizard flex-fill" id="v-pills-tabContent">
                {currentStep === "basic" && (
                  <div className="form-wizard-content active" id="v-pills-info">
                    <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                      <div className="card">
                        <div className="card-header">
                          <h5 className="mb-0">Basic Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <label className="form-label">
                              Profile Image
                            </label>
                            <div className="d-flex align-items-center flex-wrap gap-3">
                              <div className="flex-shrink-0">
                                <div className="position-relative d-flex align-items-center border rounded">
                                  <ImageWithBasePath
                                    src={doctor.profile?.profileImage || "assets/img/doctors/doctor-01.jpg"}
                                    className="avatar avatar-xxl"
                                    alt="doctor"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">ID</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={`#DR${doctor._id?.slice(-6).toUpperCase()}`}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
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
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
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
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Email<span className="text-danger ms-1">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Phone Number<span className="text-danger ms-1">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="phoneNumber"
                                  value={formData.phoneNumber}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Specialization
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="specialization"
                                  value={formData.specialization}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  License Number
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="licenseNumber"
                                  value={formData.licenseNumber}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
                              <div className="mb-3">
                                <label className="form-label">Department</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="department"
                                  value={formData.department}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-xl-4 col-md-6">
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
                      <div className="d-flex justify-content-end flex-wrap align-items-center gap-2">
                        <Link href={all_routes.allDoctorsList} className="btn btn-outline-light">
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary next-tab-btn"
                        >
                          Save &amp; Next
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {currentStep === "extra" && (
                  <div className="form-wizard-content active" id="v-pills-vituals">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                      <div className="card">
                        <div className="card-header">
                          <h5 className="mb-0">Additional Information</h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-xl-12 col-md-12">
                              <div className="mb-0">
                                <label className="form-label">Bio/About</label>
                                <textarea
                                  className="form-control"
                                  rows={4}
                                  name="bio"
                                  value={formData.bio}
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
                          className="btn btn-outline-light"
                          onClick={handleBack}
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={submitting}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Updating...
                            </>
                          ) : (
                            "Update Doctor"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <CommonFooter />
      </div>
    </>
  );
};

export default EditDoctorsComponent;
