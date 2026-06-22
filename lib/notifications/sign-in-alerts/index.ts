export {
  canDispatchSignInAlerts,
  getSignInAlertRecipients,
  isSignInAlertsEnabled,
  resolveSignInAlertRecipients,
} from "@/lib/notifications/sign-in-alerts/config";
export { DirectSignInAlertDispatcher } from "@/lib/notifications/sign-in-alerts/direct-dispatcher";
export {
  buildSignInAlertEvent,
  handleSignInAlert,
} from "@/lib/notifications/sign-in-alerts/handle";
export { mapAuthProvider } from "@/lib/notifications/sign-in-alerts/map-provider";
export { buildAdminSignInAlertEmail } from "@/lib/notifications/sign-in-alerts/template";
