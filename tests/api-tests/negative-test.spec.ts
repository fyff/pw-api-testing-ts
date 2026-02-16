import { test } from "../../utils/fixtures";
import { expect } from "../../utils/custom-expect";

[
  { userName: "11", userErrorMessage: "is too short (minimum is 3 characters)" },
  { userName: "111", userErrorMessage: "" },
  { userName: "11111111111111111111", userErrorMessage: "" },
  {
    userName: "111111111111111111111",
    userErrorMessage: "is too long (maximum is 20 characters)",
  },
].forEach(({ userName, userErrorMessage }) => {
  test(`Error message validations for ${userName}`, async ({ api }) => {
    const newUserResponse = await api
      .path("/users")
      .body({
        user: {
          email: "1",
          password: "1",
          username: userName,
        },
      })
      .clearAuth()
      .postRequest(422);

    if (userName.length == 3 || userName.length == 20) {
      expect(newUserResponse.errors).not.toHaveProperty("username");
    } else {
      expect(newUserResponse.errors.username[0]).shouldEqual(userErrorMessage);
    }
  });
});
