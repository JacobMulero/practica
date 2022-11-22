export interface Usuario {
  profileImageURL: any;
  firstName: any;
  lastName: any;
  email: any;
}
export interface Respuesta {
  user: Usuario,
  expireIn: number
}
