"use client";
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { all_routes } from '@/router/all_routes';
import { useQueue } from './useQueue';
import QueueTable from './QueueTable';
import { canAccessStage, getStageLabel, ROLE_TO_STAGE } from '@/lib/constants/stages';

interface QueuePageProps {
  requiredRole: string;
  pageTitle: string;
  stageName: string;
}

export default function QueuePage({ requiredRole, pageTitle, stageName }: QueuePageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    queue,
    loading,
    pagination,
    searchTerm,
    currentPage,
    fetchQueue,
    handleSearch,
    handlePageChange,
    removeFromQueue,
  } = useQueue();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(all_routes.login);
      return;
    }

    if (status === 'authenticated' && session?.user?.role) {
      const userRole = session.user.role;
      
      if (userRole !== 'ADMIN' && !canAccessStage(userRole, stageName)) {
        router.push(all_routes.dashboard);
        return;
      }
    }
  }, [status, session, router, requiredRole, stageName]);

  const handleHandoffSuccess = (visitId: string) => {
    removeFromQueue(visitId);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <nav aria-label="Queue pagination">
        <ul className="pagination justify-content-center mb-0">
          <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </button>
          </li>
          {startPage > 1 && (
            <>
              <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                  1
                </button>
              </li>
              {startPage > 2 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
            </>
          )}
          {pages.map((page) => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => handlePageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          {endPage < pagination.totalPages && (
            <>
              {endPage < pagination.totalPages - 1 && (
                <li className="page-item disabled">
                  <span className="page-link">...</span>
                </li>
              )}
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pagination.totalPages)}
                >
                  {pagination.totalPages}
                </button>
              </li>
            </>
          )}
          <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNextPage}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (status === 'loading') {
    return (
      <div className="page-wrapper">
        <div className="content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="d-flex align-items-center justify-content-between gap-2 mb-4 flex-wrap">
          <div className="breadcrumb-arrow">
            <h4 className="mb-1">{pageTitle}</h4>
            <div className="text-end">
              <ol className="breadcrumb m-0 py-0">
                <li className="breadcrumb-item">
                  <Link href={all_routes.dashboard}>Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href={all_routes.visits}>Visits</Link>
                </li>
                <li className="breadcrumb-item active">{pageTitle}</li>
              </ol>
            </div>
          </div>
          <div className="gap-2 d-flex align-items-center flex-wrap">
            <button
              onClick={fetchQueue}
              className="btn btn-icon btn-white"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              aria-label="Refresh"
              data-bs-original-title="Refresh"
              disabled={loading}
            >
              <i className={`ti ti-refresh ${loading ? 'fa-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSearchSubmit}>
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="d-inline-flex align-items-center mb-0">
                    Patients in Queue
                    <span className="badge bg-primary ms-2">{pagination.totalCount}</span>
                  </h5>
                </div>
                <div className="col-md-6">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by patient name, ID, visit number..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      <i className="ti ti-search" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <QueueTable
              queue={queue}
              loading={loading}
              onHandoffSuccess={handleHandoffSuccess}
            />
          </div>
        </div>

        {pagination.totalPages > 1 && (
          <div className="card">
            <div className="card-body">
              {renderPagination()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
