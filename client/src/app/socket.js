import io from "socket.io-client";
export const socketIo = io({
  reconnectionDelay: 10000, // defaults to 1000
  reconnectionDelayMax: 10000, // defaults to 5000
});

const parseCookie = (cookie) => {
  return cookie.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key.trim()] = value;
    return acc;
  }, {});
};

export const socket = io.connect("http://localhost:5050");
socket.on("connect", () => {
  console.log(`socket: ${socket.id}`);
});
