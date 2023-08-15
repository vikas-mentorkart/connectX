import { setData } from "./reducer";
export const getData = () => async (dispatch) => {
  fetch("https://pokeapi.co/api/v2/pokemon/ditto")
    .then((res) => res.json())
    .then((data) => dispatch(setData(data)))
    .catch((err) => console.log(err.message));
};
