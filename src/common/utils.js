export const apiWrapper = async (
  serviceCall,
  req,
  onSuccess,
  onError,
  onUnauthorized
) => {
  try {
    console.log(req);
    const res = await serviceCall(req);
    console.log(res);

    if (res.status === 204) {
      return onSuccess({});
    }

    const json = await res.json();

    if (res.ok) {
      return onSuccess(json);
    }

    if (res.status === 401) {
      onError("Your session has expired. Please login.");
      return onUnauthorized();
    }

    return onError(json.description ? json.description : json);
  } catch (e) {
    if (e instanceof TypeError && e.message === "Failed to fetch") {
      return onError("Quiz Me is down. Try again is a bit");
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
