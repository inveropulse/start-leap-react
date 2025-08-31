import {
  UserRole,
  AuthState,
  PortalType,
  AuthErrorCode,
} from "@/shared/services/auth/types";
import { LoginResponseDto } from "../generated";
import { useMutation } from "@tanstack/react-query";
import { useAxiosClient } from "@/shared/providers/AxiosClientProvider";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = AuthState;

export const useLoginRequest = () => {
  const { apiClient } = useAxiosClient();

  return useMutation({
    mutationKey: ["login.user.request"],
    mutationFn: async (req: LoginRequest): Promise<LoginResponse> => {
      return createAuthState(createFakeLoginResponse(req));
      // return await apiClient.auth
      //   .postApiAuthLogin(req)
      //   .then((response) => {
      //     if (response.successful == false) {
      //       throw new Error(response.message || "Login failed");
      //     }
      //     return createAuthState(response.data);
      //   })
      //   .catch((error) => {
      //     // FOR TESTING PURPOSES ONLY
      //     return createAuthState(createFakeLoginResponse());
      //   });
    },
  });
};

const createFakeLoginResponse = (req: LoginRequest): LoginResponseDto => {
  const roles = determineFakeLoginResponseRoles(req);
  return {
    token: {
      token: "mock-token-" + Date.now(),
      tokenExpiration: new Date(Date.now() + 3600 * 1000).toISOString(),
    },
    refreshToken: {
      token: "mock-refresh-token-" + Date.now(),
      refreshTokenExpiration: new Date(Date.now() + 7200 * 1000).toISOString(),
    },
    expiration: Date.now() + 3600 * 1000,
    userProfile: {
      id: "431a0b43-f902-4aeb-9b0a-986b0faed00b",
      userName: "mock.user@example.com",
      email: "mock.user@example.com",
      firstName: "Mock",
      lastName: "User",
      fullName: "Mock User",
      phoneNumber: "+1234567890",
      roles: roles,
      permissions: [],
      clinic: null,
      patient: null,
      sedationist:
        roles.includes("Admin") || roles.includes("Sedationist")
          ? {
              id: "sedationist-123",
              email: "mock.user@example.com",
              firstName: "Mock",
              lastName: "User",
              fullName: "Mock User",
              phoneNumber: "+1234567890",
            }
          : null,
    },
  };
};

const determineFakeLoginResponseRoles = (
  req: LoginRequest
): string[] | null => {
  switch (req.email.toLowerCase()) {
    case "admin@sedation.com":
      return ["Admin"];
    case "clinic@sedation.com":
      return ["ClinicAdmin"];
    case "patient@sedation.com":
      return ["PatientUser"];
    case "sedationist@sedation.com":
      return ["Sedationist"];
    default:
      return null;
  }
};

const createAuthState = (loginDto: LoginResponseDto): AuthState => {
  let isAuthenticated = true;
  let error = null;
  let errorCode = null;

  const userRole = determineUserRole(loginDto);
  const currentPortal = determineCurrentPortal(userRole);
  const portalAccess = determinePortalAccess(userRole, loginDto);

  if (!loginDto.userProfile?.id) {
    isAuthenticated = false;
    error = "Invalid user id. Please contact support.";
    errorCode = AuthErrorCode.INVALID_USER_ID;
  }

  if (userRole === null) {
    isAuthenticated = false;
    error = "Invalid user role. Please contact support.";
    errorCode = AuthErrorCode.INVALID_ROLE;
  }

  return {
    user: {
      id: loginDto.userProfile?.id ?? null,
      email: loginDto.userProfile?.email ?? null,
      fullName: loginDto.userProfile?.fullName ?? "",
      firstName: loginDto.userProfile?.firstName ?? "",
      lastName: loginDto.userProfile?.lastName ?? "",
      role: userRole,
      avatar: undefined,
      portalAccess: portalAccess,
    },
    isAuthenticated: isAuthenticated,
    isLoading: false,
    error: error,
    errorCode: errorCode,
    accessToken: loginDto?.token?.token ?? null,
    refreshToken: loginDto.refreshToken?.token ?? null,
    tokenExpiry: new Date(loginDto.token.tokenExpiration).getTime(),
    currentPortal: currentPortal,
    sessionId:
      "session-" + Date.now() + "-" + Math.random().toString(36).substring(2),
  };
};

const determineUserRole = (loginDto: LoginResponseDto): UserRole | null => {
  switch (loginDto.userProfile?.roles[0]?.toLowerCase() ?? "") {
    case "admin":
      return UserRole.ADMIN;

    case "clinic":
    case "clinicadmin":
      return UserRole.CLINIC;

    case "booking":
    case "bookingadmin":
      return UserRole.BOOKING_COORDINATOR;

    case "editor":
    case "sedationist":
      return UserRole.SEDATIONIST;

    case "patient":
    case "patientuser":
      return UserRole.PATIENT;

    // TODO - NOT NEEDED NOW BUT CAN BE USEFUL LATER
    // case "manager":
    //   return UserRole.MANAGER;
    // case "user":
    //   return UserRole.USER;
    // case "doctor":
    //   return UserRole.DOCTOR;
    // case "nurse":
    //   return UserRole.NURSE;

    default:
      return null;
  }
};

const determinePortalAccess = (
  userRole: UserRole,
  loginDto: LoginResponseDto
): AuthState["user"]["portalAccess"] => {
  const hasClinicAccess =
    UserRole.CLINIC === userRole || !!loginDto.userProfile?.clinic?.id || false;

  const hasInternalAccess =
    [UserRole.ADMIN, UserRole.BOOKING_COORDINATOR].includes(userRole) || false;

  const hasPatientAccess =
    UserRole.PATIENT === userRole ||
    !!loginDto.userProfile?.patient?.id ||
    false;

  const hasSedationistAccess =
    UserRole.SEDATIONIST === userRole ||
    !!loginDto.userProfile?.sedationist?.id ||
    false;

  return {
    [PortalType.CLINIC]: hasClinicAccess,
    [PortalType.PATIENT]: hasPatientAccess,
    [PortalType.INTERNAL]: hasInternalAccess,
    [PortalType.SEDATIONIST]: hasSedationistAccess,
  };
};

const determineCurrentPortal = (userRole: UserRole): PortalType | null => {
  switch (userRole) {
    case UserRole.CLINIC:
      return PortalType.CLINIC;

    case UserRole.ADMIN:
    case UserRole.BOOKING_COORDINATOR:
      return PortalType.INTERNAL;

    case UserRole.PATIENT:
      return PortalType.PATIENT;

    case UserRole.SEDATIONIST:
      return PortalType.SEDATIONIST;

    default:
      return null;
  }
};
