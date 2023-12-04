import axios from "axios";

const server = axios.create({
  baseURL: "http://tools.utopiaai.world:3042",
});

export default server;
