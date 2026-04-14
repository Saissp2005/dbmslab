import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import type { UserProfilePublic } from "../backend";
import { UserRole } from "../backend";
import { useBackend } from "./useBackend";

export interface CurrentUser {
  principal: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  profile: UserProfilePublic | null;
  role: UserRole;
}

export function useCurrentUser(): CurrentUser {
  const { identity, isAuthenticated } = useInternetIdentity();
  const { actor, isFetching } = useBackend();

  const { data: role } = useQuery<UserRole>({
    queryKey: ["userRole", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const { data: profile } = useQuery<UserProfilePublic | null>({
    queryKey: ["userProfile", identity?.getPrincipal().toText()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const resolvedRole = role ?? UserRole.guest;

  return {
    principal: identity?.getPrincipal().toText() ?? null,
    isAuthenticated,
    isAdmin: resolvedRole === UserRole.admin,
    profile: profile ?? null,
    role: resolvedRole,
  };
}
