import MockAdapter from "axios-mock-adapter";
import axios from "axios";

export const mock = new MockAdapter(axios);
