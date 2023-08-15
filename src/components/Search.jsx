import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addFriend } from "../store/Chat/action";
const Search = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  return (
    <div className="search">
      <form
        className="searchForm"
        onSubmit={(e) => {
          e.preventDefault();
          dispatch(addFriend(email));
        }}
      >
        <input
          type="text"
          placeholder="Find a user"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default Search;
