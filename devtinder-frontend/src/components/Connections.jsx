import React, { useEffect, useState } from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(Base_Url + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.error("Failed to fetch connections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-ring loading-lg text-[#3444DA]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto my-12 px-6">
      {/* Page Title */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-white font-Outfit">
          Your Matches
        </h1>
        <p className="text-[#94A3B8] mt-2 text-sm">
          Collaborate on projects and build developer connections.
        </p>
      </div>

      {/* Empty State */}
      {!connections || connections.length === 0 ? (
        <div className="text-center py-16 p-8 bg-[#16161a] border border-slate-800/80 rounded-2xl max-w-md mx-auto">
          <div className="text-5xl mb-4">💤</div>
          <h2 className="text-xl font-bold text-slate-300 font-Outfit">No Matches Yet</h2>
          <p className="text-[#94A3B8] mt-2 text-xs leading-relaxed">
            Keep swiping on the main feed to discover active developers and start matching!
          </p>
        </div>
      ) : (
        /* Matches Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => {
            const { _id, firstname, lastname, photoUrl, gender, About, skills } = connection;
            return (
              <div
                key={_id}
                className="bg-[#16161a] p-5 rounded-xl border border-slate-850 hover:border-slate-800 hover:shadow-micro1-glow hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  {/* Glowing Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#3444DA] to-indigo-500 shadow-md">
                      <img
                        alt={`${firstname} avatar`}
                        className="w-full h-full rounded-full object-cover"
                        src={photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      />
                    </div>
                    {/* Active Status Indicator */}
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#16161a] rounded-full"></span>
                  </div>

                  {/* Profile Summary */}
                  <div className="text-left overflow-hidden">
                    <h3 className="font-bold text-white text-lg leading-snug truncate font-Outfit">
                      {firstname} {lastname}
                    </h3>
                    {gender && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
                        {gender}
                      </span>
                    )}
                  </div>
                </div>

                {/* About Bio */}
                <p className="text-slate-400 text-xs mt-4 leading-relaxed line-clamp-3 min-h-[54px] text-left">
                  {About || "Hello! I am using DevTinder to connect with developers."}
                </p>

                {/* Skills Preview */}
                {skills && skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 mb-5">
                    {skills.slice(0, 2).map((skill, index) => (
                      <span
                        key={index}
                        className="text-[9px] uppercase tracking-wider font-semibold bg-[#212124] text-slate-300 border border-slate-850 px-2 py-0.5 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 2 && (
                      <span className="text-[9px] font-semibold text-slate-500 self-center">
                        +{skills.length - 2} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`mailto:${connection.email || ""}`}
                    className="flex-grow py-2 rounded-full text-center font-bold text-black bg-white hover:bg-slate-200 text-xs shadow-md transition-all cursor-pointer"
                  >
                    Email Dev
                  </a>
                  <button className="px-4 py-2 rounded-full bg-[#1d1d22] hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all text-xs">
                    💬 Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Connections;
