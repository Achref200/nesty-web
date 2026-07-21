"use client";

import { useSpace } from "./space-context";

/**
 * Renders the agency marketing sections or the traveller (seeker) experience
 * depending on the active space. Both subtrees are server-rendered upstream and
 * passed in as props, so the toggle is an instant client swap.
 */
export function SpaceSwitch({
  agency,
  seeker,
}: {
  agency: React.ReactNode;
  seeker: React.ReactNode;
}) {
  const { space } = useSpace();
  return <>{space === "seeker" ? seeker : agency}</>;
}
