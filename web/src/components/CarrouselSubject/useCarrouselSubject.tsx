import { getSubjects } from "@/service/subject";
import { useSubjectsStore } from "@/store/subjects";
import { TSubjects } from "@/type/subject";
import useScreenSize from "@/utils/resize";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useCarrouselSubject = () => {
  const useSubjects = useSubjectsStore();
  const router = useRouter();
  const isMobile = useScreenSize(688);

  const { data: subjects, isFetching: loadingSubjects, refetch } = useQuery<TSubjects[]>({
    queryKey: ['subjects'],
    queryFn: async () => await getSubjects(),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  useEffect(() => {
    useSubjects.setSubjects(subjects || []);
  }, [loadingSubjects])

  return {
    router,
    isMobile,
    subjects,
    loadingSubjects
  }
}