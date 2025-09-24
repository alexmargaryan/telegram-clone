export enum JwtTokenType {
  Access = "ACCESS",
  Refresh = "REFRESH",
}

export type JwtPayload = {
  sub: string;
  type: JwtTokenType;
  exp?: number;
};
