import React, { useEffect, useState } from "react";
import burnerLogoPng from "../images/burnerLogo.png";
import "./HomePage.css";
import bgSvg from "../images/svg1.svg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMongoDBUser } from "../App Redux/features/userSlice";
import { setLocalStorageUser } from "../App Redux/features/userSlice";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginContainerHeight, setLoginContainerHeight] = useState(12.5);
  const [loadingBGColor, setLoadingBGColor] = useState("#e5e5e5");
  const [uploadImage, setUploadImage] = useState();

  const [logMeIn, setLogMeIn] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [pic, setPic] = useState();
  const [picName, setPicName] = useState();

  // SignIn states
  const [emailSignIn, setEmailSignIn] = useState();
  const [passwordSignIn, setPasswordSignIn] = useState();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    dispatch(setLocalStorageUser(user));
    if (user?.emailSignIn) {
      const emailSignIn = user.emailSignIn;
      const passwordSignIn = user.passwordSignIn;
      axios
        .post("/api/login", {
          emailSignIn,
          passwordSignIn,
        })
        .then((res) => {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ emailSignIn, passwordSignIn })
          );
          dispatch(setMongoDBUser(res.data));
          navigate("/chats");
        })
        .catch((err) => {
          console.error("error");
        });
    } else if (user?.email) {
      const emailSignIn = user.email;
      const passwordSignIn = user.password;
      axios
        .post("/api/login", {
          emailSignIn,
          passwordSignIn,
        })
        .then((res) => {
          localStorage.setItem(
            "userInfo",
            JSON.stringify({ emailSignIn, passwordSignIn })
          );
          dispatch(setMongoDBUser(res.data));
          navigate("/chats");
        })
        .catch((err) => {
          console.error("error");
        });
    } else {
      navigate("/");
    }
  }, [navigate, dispatch]);

  const postDetails = (pics) => {
    if (pic === undefined) {
      console.error("Please upload your Image");
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "burner_build");
      data.append("cloud_name", "dzmv8eurf");
      fetch("https://api.cloudinary.com/v1_1/dzmv8eurf/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoadingBGColor("#d7ffd8");
          setUploadImage(false);
          setPicName(
            pics.name.length > 20 ? `${pics.name.slice(0, 20)}...` : pics.name
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.error("Please select an image");
      return;
    }
  };

  //SignUp
  const signUp_Handler = async () => {
    if (!name || !email || !password || !confirmPassword) {
      console.error("Please Fill all the Feilds");
      return;
    }
    if (password !== confirmPassword) {
      console.error("Passwords Do Not Match");
      return;
    }

    axios
      .post("/api/user", {
        name,
        email,
        password,
        pic,
      })
      .then((res) => {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            name,
            email,
            password,
            pic,
          })
        );
        dispatch(setMongoDBUser(res.data));
        navigate("/chats");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //SignIn
  const signIn_Handler = async () => {
    if (!emailSignIn || !passwordSignIn) {
      console.log("Try again");
      return;
    }
    axios
      .post("/api/login", {
        emailSignIn,
        passwordSignIn,
      })
      .then((res) => {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({ emailSignIn, passwordSignIn })
        );
        dispatch(setMongoDBUser(res.data));
        navigate("/chats");
      })
      .catch((err) => {
        console.error("error");
      });
  };

  // Guest User Handler
  const guestUser_Handler = async () => {
    axios
      .post("/api/login", {
        emailSignIn: "guest_user@gmail.com",
        passwordSignIn: "123456",
      })
      .then((res) => {
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            emailSignIn: "guest_user@gmail.com",
            passwordSignIn: "123456",
          })
        );
        dispatch(setMongoDBUser(res.data));
        navigate("/chats");
      })
      .catch((err) => {
        console.error("error");
      });
  };

  return (
    <div
      className="homepage__container"
      style={{ backgroundImage: `url(${bgSvg})` }}
    >
      <div className="logoContainer">
        <img
          loading="lazy"
          className="mainLogoBurner"
          src={burnerLogoPng}
          alt="burner"
        />
        <h1 className="mainLogoText">Burner</h1>
      </div>
      {!signIn && !signUp && (
        <div className="logIn__description">
          <h1>It's easy talking to</h1>
          <h1>your friends on</h1>
          <h1>Burner</h1>
          <h3>
            Chat with your friends
            <br /> in groups.
          </h3>
        </div>
      )}
      <div
        className="logIn__container"
        style={{ height: `${loginContainerHeight}rem` }}
      >
        {!signIn && !signUp && (
          <>
            <button
              onClick={() => {
                setSignIn(!signIn);
                setLoginContainerHeight(22.94);
              }}
              className="logIn__button "
            >
              Sign In
            </button>
            <button
              onClick={() => {
                guestUser_Handler();
                setLogMeIn(!logMeIn);
              }}
              className="logIn__button guestUser__button "
            >
              Continue as Guest
            </button>
          </>
        )}
        {signIn && !signUp && (
          <div className="signIn__window">
            <h3 className="text_leftPadding">Don't have an account?</h3>
            <button
              onClick={() => {
                setSignUp(!signUp);
                setLoginContainerHeight(34.5);
              }}
              className="logIn__button signUp__button"
            >
              Sign Up
            </button>
            <hr className="new1"></hr>
            <input
              className="inputBox"
              type="email"
              placeholder="email address"
              onChange={(e) => setEmailSignIn(e.target.value)}
            />
            <input
              className="inputBox"
              type="password"
              placeholder="password"
              onChange={(e) => setPasswordSignIn(e.target.value)}
            />
            <button
              onClick={signIn_Handler}
              type="submit"
              className="logIn__button signIn__button"
            >
              Log In
            </button>
          </div>
        )}
        {signUp && (
          <div className="signIn__window">
            <h3 className="text_leftPadding">Existing user/Guest login?</h3>
            <button
              onClick={() => {
                setSignIn(!signIn);
                setSignUp(!signUp);
                setLoginContainerHeight(12.5);
              }}
              className="logIn__button "
            >
              Sign In
            </button>
            <hr className="new1 new2"></hr>
            <input
              className="inputBox"
              type="name"
              placeholder="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <input
              className="inputBox"
              type="email"
              placeholder="email address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <input
              className="inputBox"
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <input
              className="inputBox"
              type="password"
              placeholder="confirm password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <label
              className="custom-file-upload"
              style={{ backgroundColor: loadingBGColor }}
            >
              <input
                onClick={() => {
                  setUploadImage(true);
                }}
                className="inputBox"
                type="file"
                placeholder="upload your pic"
                onChange={(e) => postDetails(e.target.files[0])}
              />
              {uploadImage && (
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              )}
              {pic ? picName : "Upload profile picture"}
            </label>
            <button
              onClick={signUp_Handler}
              type="submit"
              className="logIn__button signIn__button"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
