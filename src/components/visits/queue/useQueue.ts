import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/services/api-client';
import { PatientVisit, PaginationInfo } from '@/types/emr';

interface QueueResponse {
  queue: PatientVisit[];
  currentStage: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function useQueue() {
  const [queue, setQueue] = useState<PatientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await apiClient.get<QueueResponse>(
        `/api/clocking/queue?${params.toString()}`,
        { showErrorToast: true }
      );

      setQueue(response.queue || []);
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalCount: response.pagination.totalCount,
        limit: response.pagination.limit,
        hasNextPage: response.pagination.hasNextPage,
        hasPreviousPage: response.pagination.hasPrevPage,
      });
    } catch (error) {
      console.error('Failed to fetch queue:', error);
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeFromQueue = (visitId: string) => {
    setQueue(prevQueue => prevQueue.filter(visit => visit._id !== visitId));
    setPagination(prev => ({
      ...prev,
      totalCount: Math.max(0, prev.totalCount - 1)
    }));
  };

  return {
    queue,
    loading,
    pagination,
    searchTerm,
    currentPage,
    fetchQueue,
    handleSearch,
    handlePageChange,
    removeFromQueue,
  };
}
