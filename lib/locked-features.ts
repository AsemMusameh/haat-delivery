export const LOCKED_FEATURE_ROUTES = [
  "/community",
  "/messages",
  "/performance",
  "/ai-assist",
  "/simulator",
  "/office-brain",
  "/admin/office-brain",
  "/admin/integrations",
] as const;

export function isLockedFeature(pathname: string) {
  return LOCKED_FEATURE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
