export interface Usuario {
  profileImageURL: any;
  firstName: any;
  lastName: any;
  id: any,

  email: any;
}
export interface Respuesta {
  user: Usuario,
  expireIn: number,
  accessToken: string
}
