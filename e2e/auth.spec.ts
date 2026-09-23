import { BrowserContext, expect, Page, test } from "@playwright/test";

test.describe.serial("Auth", () => {
  const sampleUserName = `sample-user-${Date.now()}`;
  const sampleUserMail = `${sampleUserName}@example.com`;
  const oldPass = "qwerty123#a";
  const newPass = "qwerty123#B";
  const url = process.env.APP_DOMAIN ?? "http://localhost:3000/";

  let ctx: BrowserContext;
  let reusablePage: Page;

  test.beforeAll(async ({ browser }) => {
    ctx = await browser.newContext();
    reusablePage = await ctx.newPage();
  });

  test.afterAll(async () => {
    await ctx.close();
  });

  test("user can sign up", async () => {
    await reusablePage.goto("http://localhost:3000/sign-up");
    await reusablePage
      .getByRole("textbox", { name: "Username" })
      .fill(sampleUserName);
    await reusablePage
      .getByRole("textbox", { name: "Email" })
      .fill(sampleUserMail);
    await reusablePage.getByRole("textbox", { name: "Password" }).fill(oldPass);
    await reusablePage.getByRole("button", { name: "Sign up" }).click();

    await reusablePage.waitForURL("/verify");

    const codeInput = reusablePage.getByRole("textbox", { name: "Code" });
    await expect(codeInput).toBeVisible();

    let otp: string | null = null;

    await expect
      .poll(
        async () => {
          const res = await ctx.request.get(
            `/api/test/verification-code?email=${encodeURIComponent(sampleUserMail)}`
          );
          const data = await res.json();
          otp = data.otp;
          return data.otp;
        },
        {
          message: "waiting for OTP to be stored",
          timeout: 5000,
        }
      )
      .not.toBeNull();

    if (!otp) throw new Error("OTP was not retrieved");

    await codeInput.fill(otp);
    await expect(codeInput).toHaveValue(otp);
    await reusablePage.getByRole("button", { name: "Verify" }).click();
    await expect(reusablePage).toHaveURL("/");
  });

  test("user can change their password", async () => {
    await ctx.clearCookies();

    await reusablePage.goto(`${url}/sign-in`);
    await reusablePage.getByRole("link", { name: "Reset it" }).click();
    await reusablePage.waitForURL("/forgot-password");
    await reusablePage.getByRole("textbox", { name: "Email" }).click();
    await reusablePage
      .getByRole("textbox", { name: "Email" })
      .fill(sampleUserMail);

    await reusablePage.getByRole("button", { name: "Reset password" }).click();

    let resetUrl: string | null = null;

    await expect
      .poll(
        async () => {
          const res = await ctx.request.get(
            `/api/test/password-reset?email=${encodeURIComponent(sampleUserMail)}`
          );
          const data = await res.json();
          resetUrl = data.url;
          return data.url;
        },
        {
          message: "waiting for url to be stored",
          timeout: 5000,
        }
      )
      .not.toBeNull();

    if (!resetUrl) throw new Error("URL was not retrieved");

    await reusablePage.goto(resetUrl);
    await reusablePage.getByRole("textbox", { name: "Password" }).fill(newPass);
    await reusablePage.getByRole("button", { name: "Reset password" }).click();
    await expect(
      reusablePage.getByRole("dialog", { name: "Success!" })
    ).toBeInViewport();
  });

  test("user can sign in after resetting their password", async () => {
    await reusablePage.getByRole("textbox", { name: "Email" }).click();
    await reusablePage
      .getByRole("textbox", { name: "Email" })
      .fill(sampleUserMail);

    await reusablePage.getByRole("textbox", { name: "Password" }).fill(newPass);
    await reusablePage.getByRole("button", { name: "Log in" }).click();
    await reusablePage.waitForURL("/");
    await expect(
      reusablePage.getByRole("dialog", {
        name: "Success!",
        description: "You have successfully logged in.",
      })
    ).toBeInViewport();
  });
});
