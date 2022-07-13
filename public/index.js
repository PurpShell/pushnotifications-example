const VAPID_PUBLIC_KEY_HERE = "";

// check if the service worker is registered
const applyUI = async () => {
  let registration = await navigator.serviceWorker.getRegistration();
  const subscriptionButton = document.getElementById("subscribe");
  const unSubscriptionButton = document.getElementById("unSubscribe");

  if (registration) {
    subscriptionButton.hidden = true;
    subscriptionButton.onclick = null;
    unSubscriptionButton.onclick = unsubscribe;
  } else {
    unSubscriptionButton.hidden = true;
    unSubscriptionButton.onclick = null;
    subscriptionButton.onclick = subscribe;
  }
};

window.onload = applyUI;

// Functions

// POST method utility function
async function postToServer(url, data) {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });
  return response;
}

// Subscription & registering the service worker
async function subscribe() {
  let registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    registration = await navigator.serviceWorker.register("/service-worker.js", {scope: '/'});
  }
  await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY_HERE),
      })
      .catch((...a) => {
        console.log(a);
      });
  } 
  await postToServer("/subscribe/", subscription.toJSON());
  applyUI();
}

// Unsubscribing & unregistering the service worker
async function unsubscribe() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  await postToServer("/unsubscribe/", {
    endpoint: subscription?.endpoint,
  });
  await registration.unregister();
  applyUI();
}

// credits: web.dev article
// Convert a base64 string to Uint8Array.
// Must do this so the server can understand the VAPID_PUBLIC_KEY.
const urlB64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};
