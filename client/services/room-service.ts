import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/rooms";

// ========== Fetch Room ==========
export const fetchRoomByCode = async (roomCode: string, token?: string | null) => {
  const res = await axios.get(`${API_BASE_URL}/${roomCode}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data;
};

// ========== Create Room ==========
export const createRoom = async ({ name, token }: { name: string; token: string }) => {
  const res = await axios.post(
    `${API_BASE_URL}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ========== Join Room (roomCode in URL) ==========
export const joinRoomByCode = async (roomCode: string, token: string) => {
  const res = await axios.post(
    `${API_BASE_URL}/${roomCode}/join`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ========== Leave Room (roomCode in body) ==========
export const leaveRoom = async (roomCode: string, token: string) => {
  const res = await axios.patch(
    `${API_BASE_URL}/leave`,
    { roomCode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// ========== End Room (roomCode in body) ==========
export const endRoom = async (roomCode: string, token: string) => {
  const res = await axios.patch(
    `${API_BASE_URL}/end`,
    { roomCode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
