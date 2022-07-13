// Register event listener for the 'push' event.
self.addEventListener('push', function(event) {
  // Keep the service worker alive until the notification is created.
  let notification = event.data.json();
  self.registration.showNotification(
      notification.title, 
      notification.options
  );
});