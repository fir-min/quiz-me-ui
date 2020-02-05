export const serviceWrapper = async (serviceCall, req, onSuccess, onError) => {
  try {
    const res = await serviceCall(req);
    console.log(res);
    const json = await res.json();
    if (res.ok) {
      onSuccess(json);
    } else {
      onError(json.description ? json.description : json);
    }
  } catch (e) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      onError("Quiz Me is down. Try again is a bit");
    }
    throw e;
  }
};

export const saveUserData = data => {
  localStorage.setItem(
    "quiz_me",
    JSON.stringify({
      token: data.token,
      email: data.email,
      id: data.id
    })
  );
};

export const clearUserData = () => {
  localStorage.setItem("quiz_me", "");
};

export const readUserData = () => {
  let data = localStorage.getItem("quiz_me");
  if (typeof data !== "undefined" && data !== null && data !== "") {
    console.log(data);
    data = JSON.parse(data);
    if (data.token === undefined || data.token === null) {
      console.log("there is nothing saved in local storage");
    } else {
      return data;
    }
  }

  return null;
};
