import {nanoid} from "nanoid";

const generateRoomId = () => {
  return nanoid(7); // e.g., "A1b2C3d4"
};

export default generateRoomId;
// This function generates a unique room ID using nanoid with a length of 7 characters.