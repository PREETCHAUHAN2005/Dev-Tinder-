import { test, expect } from "@playwright/test";

const self = { _id: "self", firstname: "Preet", lastname: "Chauhan", email: "preet@example.test", gender: "male", age: 22, About: "Building useful things with curious people.", skills: ["React", "Node.js"], photoUrl: "", isPremium: false };
const asha = { _id: "dev-2", firstname: "Asha", lastname: "Jain", gender: "female", age: 24, About: "Learning systems and building open source tools.", skills: ["Python", "React", "TypeScript", "Docker", "Go"], photoUrl: "", email: "asha@example.test" };
const rohan = { _id: "dev-3", firstname: "Rohan", lastname: "Mehta", gender: "male", age: 25, About: "Looking for a collaborator on developer tools.", skills: ["Node.js", "MongoDB"], photoUrl: "", email: "rohan@example.test" };

async function setup(page, signedIn = true) {
  const model = {
    signedIn, user: { ...self }, feed: [{ ...asha }, { ...rohan }],
    connections: [{ ...asha }],
    requests: [{ _id: "request-1", fromUserId: { ...asha } }, { _id: "request-2", fromUserId: { ...rohan } }],
    inbox: [{ user: { ...asha }, unreadCount: 2, lastMessage: { text: "What are you building?" } }],
    messages: [{ _id: "message-1", fromUserId: asha._id, toUserId: self._id, text: "Hello, let's build something." }],
    calls: [], failures: {}, delays: {}, match: false, plans: { silver: 499, gold: 999 }, orderType: null, pageErrors: [],
  };
  page.on("pageerror", (error) => model.pageErrors.push(error.message));
  await page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ contentType: "text/css", body: "" }));
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.route("https://broken.example/**", (route) => route.abort());
  await page.route("https://checkout.razorpay.com/**", (route) => route.fulfill({
    contentType: "text/javascript",
    body: "window.Razorpay = class { constructor(options) { window.__checkout = options; } on() {} open() { window.__checkoutOpened = true; } };",
  }));
  await page.route("http://localhost:7777/**", async (route) => {
    const request = route.request();
    const pathname = new URL(request.url()).pathname;
    const method = request.method();
    if (pathname.startsWith("/socket.io")) { await route.abort(); return; }
    const headers = { "access-control-allow-origin": "http://127.0.0.1:4173", "access-control-allow-credentials": "true", "access-control-allow-headers": "content-type", "access-control-allow-methods": "GET, POST, PATCH, OPTIONS" };
    if (method === "OPTIONS") { await route.fulfill({ status: 204, headers }); return; }
    let body;
    try { body = request.postDataJSON(); } catch { body = null; }
    model.calls.push({ method, path: pathname, body });
    const key = method + " " + pathname;
    if (model.delays[key]) await new Promise((resolve) => setTimeout(resolve, model.delays[key]));
    const respond = (json, status = 200) => route.fulfill({ status, headers, json });
    if (model.failures[key]) return respond({ message: model.failures[key].message, error: model.failures[key].message }, model.failures[key].status || 500);
    if (pathname === "/profile/view") return respond(model.signedIn ? model.user : { message: "Unauthorized" }, model.signedIn ? 200 : 401);
    if (pathname === "/login" && method === "POST") { model.signedIn = true; return respond(model.user); }
    if (pathname === "/signup" && method === "POST") { model.signedIn = true; model.user = { ...model.user, ...body }; return respond({ user: model.user }); }
    if (pathname === "/logout") { model.signedIn = false; return respond({ message: "Logged out" }); }
    if (pathname === "/profile/edit") { model.user = { ...model.user, ...body }; return respond({ data: model.user }); }
    if (pathname === "/user/feed") return respond({ data: model.feed });
    if (pathname === "/user/connections") return respond({ data: model.connections });
    if (pathname === "/user/request/received") return respond({ data: model.requests });
    if (pathname.startsWith("/request/send/")) {
      const id = pathname.split("/").at(-1);
      model.feed = model.feed.filter((person) => person._id !== id);
      return respond({ message: model.match ? "It's a Match!" : "Connection request sent" });
    }
    if (pathname.startsWith("/request/review/")) {
      const id = pathname.split("/").at(-1);
      model.requests = model.requests.filter((item) => item._id !== id);
      return respond({ message: "Request reviewed" });
    }
    if (pathname === "/chat") return respond({ data: model.inbox });
    if (pathname.startsWith("/chat/")) {
      if (method === "POST") {
        const message = { _id: "message-" + (model.messages.length + 1), fromUserId: self._id, toUserId: pathname.split("/").at(-1), text: body.text };
        model.messages.push(message);
        return respond({ data: message });
      }
      return respond({ data: model.messages, user: asha });
    }
    if (pathname === "/premium/verify") return respond({ isUserPremium: model.user.isPremium, membershipType: model.user.membershipType, plans: model.plans });
    if (pathname === "/payment/create") { model.orderType = body.type; return respond({ order: { id: "order_test", amount: model.plans[body.type] * 100, currency: "INR" }, keyId: "rzp_test_fixture" }); }
    if (pathname === "/payment/verify") { model.user = { ...model.user, isPremium: true, membershipType: model.orderType }; return respond({ user: model.user, membershipType: model.orderType }); }
    return respond({ message: "Unexpected test endpoint: " + pathname }, 500);
  });
  return model;
}

async function noOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy();
}
function calls(model, method, path) { return model.calls.filter((call) => call.method === method && call.path === path); }

test("all existing screens render and fit the viewport", async ({ page }, info) => {
  const model = await setup(page);
  const screens = [
    ["/", "Find your kind of developer."], ["/profile", "The person behind the code."],
    ["/connections", "Good people. Great possibilities."], ["/requests", "New connections, waiting on you."],
    ["/chat", "Messages"], ["/chat/dev-2", "Asha Jain"], ["/premium", "Make yourself at home."], ["/contact", "Contact"],
  ];
  for (let i = 0; i < screens.length; i++) {
    await page.goto(screens[i][0]);
    await expect(page.getByRole("heading", { name: screens[i][1], exact: true })).toBeVisible();
    await noOverflow(page);
    await page.screenshot({ path: info.outputPath("screen-" + i + ".jpg"), type: "jpeg", quality: 70, fullPage: true, animations: "disabled" });
  }
  await expect(page.getByRole("navigation", { name: info.project.name === "mobile" ? "Mobile navigation" : "Main navigation", exact: true })).toBeVisible();
  expect(model.pageErrors).toEqual([]);
});

test("login validates, displays server errors, and preserves the login contract", async ({ page }, info) => {
  const model = await setup(page, false);
  await page.goto("/login");
  await page.screenshot({ path: info.outputPath("login.jpg"), type: "jpeg", quality: 70, fullPage: true, animations: "disabled" });
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Please fill in all fields.");
  expect(calls(model, "POST", "/login")).toHaveLength(0);
  await page.getByLabel("Email address", { exact: true }).fill("preet@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Example-password-123");
  model.failures["POST /login"] = { status: 401, message: "Please check your credentials." };
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Please check your credentials.");
  delete model.failures["POST /login"];
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/4173\/$/);
  expect(calls(model, "POST", "/login").at(-1).body).toEqual({ email: "preet@example.test", password: "Example-password-123" });
});

test("signup keeps existing fields, payload, and profile redirect", async ({ page }) => {
  const model = await setup(page, false);
  await page.goto("/login");
  await page.getByRole("button", { name: "Create an account", exact: true }).click();
  await page.getByLabel("First name", { exact: true }).fill("Mira");
  await page.getByLabel("Last name", { exact: true }).fill("Shah");
  await page.getByLabel("Gender", { exact: true }).selectOption("female");
  await page.getByLabel("Email address", { exact: true }).fill("mira@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Example-password-123");
  await page.getByRole("button", { name: "Create account", exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  expect(calls(model, "POST", "/signup").at(-1).body).toEqual({ firstname: "Mira", lastname: "Shah", email: "mira@example.test", password: "Example-password-123", gender: "female" });
});

test("profile saves the same data and the preview has no decision actions", async ({ page }) => {
  const model = await setup(page);
  await page.goto("/profile");
  await page.getByLabel("First name", { exact: true }).fill("Preet");
  await page.getByLabel("Age", { exact: true }).fill("23");
  await page.getByLabel("About you", { exact: true }).fill("Building tools with people who care.");
  await page.getByLabel("Skills", { exact: true }).fill("React, Python, , TypeScript");
  await expect(page.locator(".dt-live-preview").getByText("Python", { exact: true })).toBeVisible();
  await expect(page.locator(".dt-live-preview").getByRole("button")).toHaveCount(0);
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Profile saved.");
  expect(calls(model, "PATCH", "/profile/edit").at(-1).body).toEqual({ firstname: "Preet", lastname: "Chauhan", photoUrl: "", age: 23, gender: "male", About: "Building tools with people who care.", skills: ["React", "Python", "TypeScript"] });
  expect(model.calls.filter((call) => call.path.startsWith("/request/send/"))).toHaveLength(0);
});

test("pass and like preserve status values and a final-card match remains visible", async ({ page }) => {
  const model = await setup(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Pass on Asha", exact: true }).click();
  await expect(page.getByRole("button", { name: "Like Rohan", exact: true })).toBeVisible();
  expect(calls(model, "POST", "/request/send/ignored/dev-2")).toHaveLength(1);
  model.match = true;
  await page.getByRole("button", { name: "Like Rohan", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Send a message" })).toHaveAttribute("href", "/chat/dev-3");
  expect(calls(model, "POST", "/request/send/interested/dev-3")).toHaveLength(1);
  await dialog.getByRole("button", { name: "Close match confirmation" }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("button", { name: "Keep discovering" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "You're all caught up" })).toBeVisible();
});

test("failed decisions retain the card and provide retry feedback", async ({ page }) => {
  const model = await setup(page);
  model.failures["POST /request/send/interested/dev-2"] = { status: 500, message: "Fixture failure" };
  model.delays["POST /request/send/interested/dev-2"] = 600;
  await page.goto("/");
  await page.getByRole("button", { name: "Like Asha", exact: true }).click();
  await expect(page.getByRole("button", { name: "Like Asha", exact: true })).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText("Your decision was not saved.");
  await expect(page.getByRole("button", { name: "Like Asha", exact: true })).toBeEnabled();
  expect(model.feed[0]._id).toBe("dev-2");
});

test("requests use request IDs and preserve accept and decline status values", async ({ page }) => {
  const model = await setup(page);
  await page.goto("/requests");
  model.failures["POST /request/review/accepted/request-1"] = { status: 500, message: "Fixture failure" };
  let first = page.locator(".dt-request-card").first();
  await first.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Your response was not saved.");
  await expect(page.locator(".dt-request-card")).toHaveCount(2);
  delete model.failures["POST /request/review/accepted/request-1"];
  await first.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(page.locator(".dt-request-card")).toHaveCount(1);
  await expect(page.getByRole("status")).toContainText("Connection accepted.");
  first = page.locator(".dt-request-card").first();
  await first.getByRole("button", { name: "Decline", exact: true }).click();
  await expect(page.getByRole("heading", { name: "You're up to date" })).toBeVisible();
  expect(calls(model, "POST", "/request/review/rejected/request-2")).toHaveLength(1);
});

test("load errors can be retried and empty states offer existing destinations", async ({ page }) => {
  const model = await setup(page);
  const cases = [
    { page: "/", api: "/user/feed", collection: "feed", error: "Couldn't load developers", empty: "You're all caught up", button: "Try again" },
    { page: "/connections", api: "/user/connections", collection: "connections", error: "Couldn't load connections", empty: "Your circle starts with one connection", button: "Try again" },
    { page: "/requests", api: "/user/request/received", collection: "requests", error: "Couldn't load requests", empty: "You're up to date", button: "Try again" },
  ];
  for (const item of cases) {
    model.failures["GET " + item.api] = { status: 500, message: "Fixture failure" };
    model[item.collection] = [];
    await page.goto(item.page);
    await expect(page.getByRole("heading", { name: item.error, exact: true })).toBeVisible();
    delete model.failures["GET " + item.api];
    await page.getByRole("button", { name: item.button, exact: true }).click();
    await expect(page.getByRole("heading", { name: item.empty, exact: true })).toBeVisible();
  }
  model.inbox = [];
  model.failures["GET /chat"] = { status: 500, message: "Couldn't load test conversations." };
  await page.goto("/chat");
  await expect(page.getByRole("alert")).toContainText("Couldn't load test conversations.");
  delete model.failures["GET /chat"];
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "Your next hello is out there" })).toBeVisible();
});

test("chat preserves trimming, sending, and failure recovery", async ({ page }) => {
  const model = await setup(page);
  await page.goto("/chat/dev-2");
  await expect(page.getByText("Hello, let's build something.")).toBeVisible();
  await page.getByLabel("Write a message", { exact: true }).fill("   ");
  await expect(page.getByRole("button", { name: "Send message" })).toBeDisabled();
  await page.getByLabel("Write a message", { exact: true }).fill("  Hello from DevTinder  ");
  model.failures["POST /chat/dev-2"] = { status: 500, message: "Message was not sent." };
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("alert")).toContainText("Message was not sent.");
  await expect(page.getByLabel("Write a message", { exact: true })).toHaveValue("  Hello from DevTinder  ");
  delete model.failures["POST /chat/dev-2"];
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("log")).toContainText("Hello from DevTinder");
  await expect(page.getByLabel("Write a message", { exact: true })).toHaveValue("");
  expect(calls(model, "POST", "/chat/dev-2").at(-1).body).toEqual({ text: "Hello from DevTinder" });
});

test("a forbidden chat shows the existing connection requirement", async ({ page }) => {
  const model = await setup(page);
  model.failures["GET /chat/dev-2"] = { status: 403, message: "Connection required" };
  await page.goto("/chat/dev-2");
  await expect(page.getByRole("alert")).toContainText("Chat opens after you both accept the connection.");
});

for (const type of ["silver", "gold"]) {
  test(type + " checkout uses existing order and verification contracts", async ({ page }) => {
    const model = await setup(page);
    await page.goto("/premium");
    await page.getByRole("button", { name: "Choose " + (type === "gold" ? "Gold" : "Silver") }).click();
    await expect.poll(() => page.evaluate(() => Boolean(window.__checkoutOpened))).toBeTruthy();
    expect(calls(model, "POST", "/payment/create").at(-1).body).toEqual({ type });
    const checkout = await page.evaluate(() => ({ amount: window.__checkout.amount, currency: window.__checkout.currency, order: window.__checkout.order_id }));
    expect(checkout).toEqual({ amount: model.plans[type] * 100, currency: "INR", order: "order_test" });
    await page.evaluate(() => window.__checkout.handler({ razorpay_order_id: "order_test", razorpay_payment_id: "payment_test", razorpay_signature: "signature_test" }));
    await expect(page.getByRole("heading", { name: (type === "gold" ? "Gold" : "Silver") + " looks good on you." })).toBeVisible();
    expect(calls(model, "POST", "/payment/verify").at(-1).body).toEqual({ razorpay_order_id: "order_test", razorpay_payment_id: "payment_test", razorpay_signature: "signature_test" });
  });
}

test("logout clears the cached feed before the next login", async ({ page }, info) => {
  const model = await setup(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Like Asha" })).toBeVisible();
  await page.locator(info.project.name === "mobile" ? ".dt-mobile-account summary" : ".dt-account summary").click();
  await page.getByRole("button", { name: "Log out", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  model.feed = [{ ...rohan }];
  await page.getByLabel("Email address", { exact: true }).fill("preet@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Example-password-123");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page.getByRole("button", { name: "Like Rohan" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Like Asha" })).toHaveCount(0);
});

test("image failures and long content fit a 320px viewport", async ({ page }) => {
  const model = await setup(page);
  model.feed = [{ ...asha, firstname: "AReallyLongDeveloperName", lastname: "WithALongSurname", photoUrl: "https://broken.example/avatar.png", skills: ["AReallyLongSkillNameWithoutSpaces".repeat(4), "React"], About: "A".repeat(500) }];
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const photo = page.locator(".dt-card-front .dt-profile-photo");
  await expect(photo.locator("img")).toHaveCount(0);
  await expect(photo.locator(".dt-avatar-initials")).toBeVisible();
  await noOverflow(page);
  await expect(page.getByRole("navigation", { name: "Mobile navigation", exact: true })).toBeVisible();
});

test("loading feedback respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const model = await setup(page);
  model.delays["GET /user/feed"] = 1000;
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText("Finding your next connection");
  expect(await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)).toBeTruthy();
  const duration = await page.locator(".dt-state-loading").evaluate((element) => getComputedStyle(element, "::after").animationDuration);
  expect(parseFloat(duration)).toBeLessThan(0.1);
  await expect(page.getByRole("button", { name: "Like Asha" })).toBeVisible();
});
