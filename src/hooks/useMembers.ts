import { useCallback } from "react";
import { useDataStore, Member } from "../store/useDataStore";
import { useApi } from "./useApi";

export function useMembers() {
  const {
    members,
    fetchMembers,
    addMember: storeAddMember,
    updateMember: storeUpdateMember,
    deleteMember: storeDeleteMember,
  } = useDataStore();

  const fetchMembersApi = useApi(async () => {
    await fetchMembers();
    return members;
  }, members);

  const addMemberApi = useApi(
    async (memberData: Omit<Member, "id" | "created_at" | "updated_at">) => {
      await storeAddMember(memberData);
      return { success: true };
    }
  );

  const updateMemberApi = useApi(
    async (
      id: string,
      updates: Partial<Omit<Member, "id" | "created_at" | "updated_at">>
    ) => {
      await storeUpdateMember(id, updates);
      return { success: true };
    }
  );

  const deleteMemberApi = useApi(async (id: string) => {
    await storeDeleteMember(id);
    return { success: true };
  });

  const fetchMembersCallback = useCallback(() => {
    fetchMembersApi.execute();
  }, [fetchMembersApi.execute]);

  const addMemberCallback = useCallback(
    (memberData: Omit<Member, "id" | "created_at" | "updated_at">) => {
      addMemberApi.execute(memberData);
    },
    [addMemberApi.execute]
  );

  const updateMemberCallback = useCallback(
    (
      id: string,
      updates: Partial<Omit<Member, "id" | "created_at" | "updated_at">>
    ) => {
      updateMemberApi.execute(id, updates);
    },
    [updateMemberApi.execute]
  );

  const deleteMemberCallback = useCallback(
    (id: string) => {
      deleteMemberApi.execute(id);
    },
    [deleteMemberApi.execute]
  );

  return {
    members,
    fetchMembers: fetchMembersCallback,
    addMember: addMemberCallback,
    updateMember: updateMemberCallback,
    deleteMember: deleteMemberCallback,
    loading:
      fetchMembersApi.loading ||
      addMemberApi.loading ||
      updateMemberApi.loading ||
      deleteMemberApi.loading,
    error:
      fetchMembersApi.error ||
      addMemberApi.error ||
      updateMemberApi.error ||
      deleteMemberApi.error,
  };
}
