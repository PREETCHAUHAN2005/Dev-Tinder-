import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, photoURL, age, gender, about } = user;
  return (
    <div>
      <div className="card bg-base-100 w-96 shadow-sm">
        <figure>
          <img src={user.photoURL} alt="photo" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p> {gender + ", " + age}</p>}
          {about && <p>{about}</p>}

          <div className="card-actions justify-center flex space-x-6">
            <button className="btn btn-primary">Ignore</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
